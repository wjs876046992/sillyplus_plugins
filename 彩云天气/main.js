/**
 * @name 彩云天气
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description 彩云天气
 * v1.0.0 初始化
 * @rule [cmd:cy] [oper:sub] [addr?]
 * @rule [cmd:cy] [addr] [day?:今日天气|明日天气|后日天气|三日天气]
 * @form {key: "cy.cy_key", title: "彩云天气API Token", tooltip: "请在彩云天气官网申请", required: true, valueType: 'text'}
 * @form {key: "cy.amap_key", title: "高德地图开放平台key", tooltip: "用于获取地址的经纬度", required: true, valueType: 'text'}
 * @cron1 0 30 7 * * *
 * @public true
 * @admin true
 * @class 工具
 * @create_at 2099-01-01 10:09:00
 * @icon https://img.icons8.com/?size=100&id=21525&format=png&color=000000
 */
const axios = require('axios');
const {Adapter, Bucket, sender: s, console, sleep} = require('sillygirl');

// 枚举映射表
const skyMap = {
    CLEAR_DAY: '晴（白天）', CLEAR_NIGHT: '晴（夜间）',
    PARTLY_CLOUDY_DAY: '多云（白天）', PARTLY_CLOUDY_NIGHT: '多云（夜间）',
    CLOUDY: '阴', LIGHT_HAZE: '轻雾霾', MODERATE_HAZE: '中雾霾', HEAVY_HAZE: '重雾霾',
    LIGHT_RAIN: '小雨', MODERATE_RAIN: '中雨', HEAVY_RAIN: '大雨', STORM_RAIN: '暴雨',
    FOG: '雾', LIGHT_SNOW: '小雪', MODERATE_SNOW: '中雪', HEAVY_SNOW: '大雪', STORM_SNOW: '暴雪',
    DUST: '浮尘', SAND: '沙尘', WIND: '大风'
};
const windDirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];

function degToCompass(deg) {
    return windDirs[Math.round(deg / 45) % 8];
}

function speedToBeaufort(speed) {
    const v = speed * 3.6;
    if (v < 1) return '0级 无风';
    if (v < 6) return '1级 软风';
    if (v < 12) return '2级 轻风';
    if (v < 20) return '3级 微风';
    if (v < 29) return '4级 和风';
    if (v < 39) return '5级 清风';
    if (v < 50) return '6级 强风';
    if (v < 62) return '7级 疾风';
    if (v < 75) return '8级 大风';
    if (v < 89) return '9级 烈风';
    if (v < 103) return '10级 狂风';
    if (v < 118) return '11级 暴风';
    return '12级 飓风';
}

function describeAQI(aqi) {
    if (aqi <= 50) return '优';
    if (aqi <= 100) return '良';
    if (aqi <= 150) return '轻度污染';
    if (aqi <= 200) return '中度污染';
    if (aqi <= 300) return '重度污染';
    return '严重污染';
}

function formatRange(obj, unit = '', scale = 1) {
    if (!obj) return 'N/A';
    const min = (obj.min * scale).toFixed(1);
    const max = (obj.max * scale).toFixed(1);
    const avg = (obj.avg * scale).toFixed(1);
    return `${min} ~ ${max}${unit}（平均 ${avg}${unit}）`;
}

function formatWindSpeed(wind) {
    const min = wind.min?.speed?.toFixed(1);
    const max = wind.max?.speed?.toFixed(1);
    const avg = wind.avg?.speed?.toFixed(1);

    if (min && max && avg) {
        return `${min} ~ ${max} km/h（平均 ${avg} km/h）`;
    }
    return 'N/A';
}

function formatPrecipitation(p) {
    const hasData = ['min', 'max', 'avg'].some(k => p?.[k] != null);
    if (!hasData) return 'N/A';

    return `${p.min?.toFixed(1)} ~ ${p.max?.toFixed(1)} mm（平均 ${p.avg?.toFixed(1)} mm）`;
}

function describeRainfall(avg) {
    if (avg === 0) return '☀️ 无降水';
    if (avg < 2) return '🌦 零星小雨';
    if (avg < 10) return '🌧 小到中雨';
    if (avg < 25) return '🌧 中雨';
    return '⛈ 暴雨';
}

function getRadiationLevel(avg) {
    if (avg < 200) return '低';
    if (avg < 500) return '中';
    if (avg < 800) return '高';
    return '极高';
}

function getVisibilityLevel(avg) {
    if (avg < 1) return '极差';
    if (avg < 3) return '差';
    if (avg < 5) return '一般';
    if (avg < 10) return '良好';
    return '优';
}

function getPM25Level(avg) {
    if (avg <= 35) return '优';
    if (avg <= 75) return '良';
    if (avg <= 115) return '轻度污染';
    if (avg <= 150) return '中度污染';
    return '重度污染';
}

async function getWeatherText(token, ll, offset = 0, count = 1) {
    const url = `https://api.caiyunapp.com/v2.6/${token}/${ll}/daily`;
    const res = await axios.get(url, {
        params: {dailysteps: offset + count, lang: 'zh_CN', unit: 'metric'}
    });

    if (res.data.status !== 'ok') throw new Error(res.data.status);
    const d = res.data.result.daily;

    let text = '';
    for (let i = offset; i < offset + count; i++) {
        const date = d.temperature[i].date.split('T')[0];
        const wVal = d.skycon[i]?.value;
        const weather = skyMap[wVal] || wVal;
        const astro = d.astro[i];
        const wind = d.wind[i];
        const aqiObj = d.air_quality.aqi[i];
        const pm25Obj = d.air_quality.pm25[i];
        const li = d.life_index;
        const p = d.precipitation[i];

        const windText = formatWindSpeed(wind);
        const windDirText = degToCompass(wind.avg.direction);
        const windDeg = wind.avg.direction?.toFixed(1);
        const windSpeedMs = wind.avg.speed / 3.6;
        const windLevel = speedToBeaufort(windSpeedMs);

        text += `📅 日期：${date}\n`;
        text += `🌤️ 天气：${weather}\n`;
        text += `🌧 降水：${formatPrecipitation(p)}，${describeRainfall(p.avg)}\n`;
        text += `🌅 日出：${astro.sunrise.time}，日落：${astro.sunset.time}\n`;
        text += `🌡️ 温度：${formatRange(d.temperature[i], '°C')}\n`;
        text += `📈 气压：${formatRange(d.pressure[i], 'kPa', 0.001)}\n`;
        text += `💧 湿度：${formatRange(d.humidity[i], '%', 100)}\n`;
        text += `💨 风速：${windText}\n`;
        text += `↖️ 风向：${windDirText}（${windDeg}°）\n`;
        text += `🌀 风力等级：${windLevel}\n`;
        text += `☁️ 云量：${formatRange(d.cloudrate[i], '%', 100)}\n`;
        text += `🔆 辐射：${formatRange(d.dswrf[i], ' W/m²')}，${getRadiationLevel(d.dswrf[i].avg)}\n`;
        text += `👁️ 能见度：${formatRange(d.visibility[i], ' km')}，${getVisibilityLevel(d.visibility[i].avg)}\n`;
        text += `🌫️ PM2.5：${formatRange(pm25Obj, ' μg/m³')}，${getPM25Level(pm25Obj.avg)}\n`;

        if (aqiObj) {
            const avg = aqiObj.avg.chn;
            const min = aqiObj.min.chn;
            const max = aqiObj.max.chn;
            text += `🌀 AQI（中国）：${min} ~ ${max}（平均 ${avg}，${describeAQI(avg)}）\n`;
        } else {
            text += `🌀 AQI（中国）：暂无数据\n`;
        }

        text += `🧴 紫外线：${li.ultraviolet[i]?.desc}\n`;
        text += `👚 穿衣：${li.dressing[i]?.desc}\n`;
        text += `🚗 洗车：${li.carWashing[i]?.desc}\n`;
        text += `🤒 感冒：${li.coldRisk[i]?.desc}\n`;
        text += `😌 舒适度：${li.comfort[i]?.desc}\n`;
        text += `${'='.repeat(50)}\n`;
    }

    return text;
}

// 获取经纬度
async function getCoordinates(address, amapKey) {

    const config = {
        method: 'get',
        url: `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&city=&batch=&sig=&output=JSON&callback=&Key=${amapKey}`,
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Host': 'restapi.amap.com',
            'Connection': 'keep-alive'
        }
    };
    // console.log('高德地图API请求:', JSON.stringify(config, null, 2));

    const res = await axios(config)
    // console.log('高德地图API响应:', JSON.stringify(res.data, null, 2));
    return res.data.geocodes
        .filter(geo => geo.formatted_address && geo.location && geo.adcode);
}

async function subscribe(amap_key, address = '') {
    if (!address) {
        await s.reply('请输入订阅天气的地址：\n');
        const input = await s.listen({
            timeout: 3 * 60 * 1000
        })
        address = await input.getContent();
    }
    if (!address) {
        await s.reply('❌ 错误：地址不能为空。');
        return;
    }
    const geo = await handleAddress(address, amap_key);
    const subscription = {
        address: geo.formatted_address,
        adcode: geo.adcode,
        platform: await s.getPlatform(),
        bot_id: await s.getBotId(),
        chat_id: await s.getChatId(),
        user_id: await s.getUserId(),
    }
    const bucket = new Bucket('cy');
    const subscriptions = await bucket.get('subscriptions', {});
    if (!subscriptions[geo.location]) {
        subscriptions[geo.location] = [];
    }
    subscriptions[geo.location].push(subscription);
    await bucket.set('subscriptions', subscriptions);
    await s.reply(`✅ 订阅成功！地址：${geo.formatted_address}\n🆔 行政区划代码：${geo.adcode}\n📍 经纬度：${geo.location}`);
}

// 处理请求到的地址
async function handleAddress(addr, amap_key) {

    const geocodes = await getCoordinates(addr, amap_key);
    if (!Array.isArray(geocodes) || geocodes.length === 0) {
        return '❌ 没有匹配到地址信息。';
    } else if (geocodes.length === 1) {
        return geocodes[0];
    }

    const addressText = geocodes
        .map((geo, index) => {
            return `#${index + 1}\n📍 地址：${geo.formatted_address}\n📌 经纬度：${geo.location}\n🆔 行政区划代码：${geo.adcode}`;
        }).join('\n\n');
    await s.reply('找到多个匹配的地址，请选择一个：\n' + addressText);
    const input = await s.listen({
        timeout: 3 * 60 * 1000
    })
    const index = await input.getContent();
    const idx = parseInt(index) - 1;
    if (isNaN(idx) || idx < 0 || idx >= geocodes.length) {
        console.error('❌ 错误：无效的地址选择');
        return;
    }
    return geocodes[idx];
}

/**
 * 处理订阅
 * @returns {Promise<void>}
 * */
async function handleSub() {
    const bucket = new Bucket('cy');
    const subscriptions = await bucket.get('subscriptions', {});
    if (Object.keys(subscriptions).length === 0) {
        console.debug('没有订阅记录');
        return;
    }
    const amap_key = await bucket.get('amap_key');
    if (!amap_key) {
        console.error('❌ 错误：请在配置中设置高德地图API Key');
        return;
    }
    const cy_key = await bucket.get('cy_key');
    if (!cy_key) {
        console.error('❌ 错误：请在配置中设置彩云天气API Token');
        return;
    }
    console.debug(`处理 ${JSON.stringify(subscriptions)} 订阅`);
    for (const [location, subs] of Object.entries(subscriptions)) {
        try {
            const text = await getWeatherText(cy_key, location);
            for (const sub of subs) {
                const platform = sub.platform;
                const bot_id = sub.bot_id;
                const chat_id = sub.chat_id;
                const user_id = sub.user_id;
                const address = sub.address || '未知地址';
                const adcode = sub.adcode || '未知行政区划代码';
                if (!platform || !bot_id || !user_id) {
                    console.error('❌ 错误：订阅信息不完整，无法发送消息');
                    continue;
                }
                console.debug(`发送订阅消息到 ${platform} ${bot_id} ${chat_id} ${user_id}`);
                // 使用 sender 发送消息
                const adapter = new Adapter({ platform, bot_id});
                if (!adapter) {
                    console.error(`❌ 错误：无法找到适配器 ${platform} ${bot_id}`);
                    continue;
                }

                adapter && await adapter.push({
                    chat_id: chat_id,
                    user_id: user_id,
                    content: `📍 地址：${address}\n🆔 行政区划代码：${adcode}\n\n${text}`
                });
                await sleep(5000); // 避免请求过快
            }
        } catch (e) {
            console.error('❌ 错误：', e.message);
        }
    }
}

// 示例调用
(async () => {


    if ("cron" === await s.getPlatform()) {
        // console.log('正在处理订阅...');
        await handleSub();
        return;
    }

    const bucket = new Bucket('cy');
    const cy_key = await bucket.get('cy_key');
    const amap_key = await bucket.get('amap_key');
    if (!cy_key || !amap_key) {
        console.error('❌ 错误：请在配置中设置彩云天气API Token和高德地图API Key');
        return;
    }

    const oper = await s.param('oper');
    const addr = await s.param('addr');
    if (oper === 'sub') {
        await subscribe(amap_key, addr);
        return;
    }

    let day = await s.param('day');
    let offset = 0;
    if (!day || day === '今日天气') {
        day = 1;
    } else if (day === '明日天气') {
        offset = 1;
        day = 1;
    } else if (day === '后日天气') {
        offset = 2;
        day = 1;
    } else if (day === '三日天气') {
        day = 3;
    } else {
        await s.reply(`❗️ 错误：无效的 day 参数。请使用 "今日天气"、"明日天气"、"后日天气" 或 "三日天气"。`);
        return;
    }
    if (!addr) {
        console.error('❌ 错误：请提供地址');
        return;
    }
    if (day < 1 || day > 3) {
        console.error('❌ 错误：num 参数必须在 1 到 3 之间');
        return;
    }
    let geo = await handleAddress(addr, amap_key);

    try {
        const text = await getWeatherText(cy_key, geo.location, offset, day);
        await s.reply(`📍 地址：${geo.formatted_address}\n🆔 行政区划代码：${geo.adcode}\n\n${text}`);
    } catch (e) {
        console.error('❌ 错误：', e.message);
    }
})();