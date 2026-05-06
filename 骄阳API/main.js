/**
 * @name 骄阳API
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.4
 * @description 骄阳API合集，只记录好玩的免费的API。
 * v1.0.1 wechat ferry 图片发送，但是需要wcf 傻妞在局域网，同时需要nginx代理，仅自用吧
 * v1.0.2 修复摸鱼倒计时和60s读懂世界的图片发送问题
 * v1.0.3 增加抖音短链、小红书解析、疯狂星期四
 * v1.0.4 增加随机买家秀和随机美腿秀
 * @form {key: "txcnm.token", title: "骄阳API token", required: true}
 * @rule1 raw (^摸鱼$|^moyu$|^my$|^摸鱼倒计时$)
 * @rule 60s
 * @rule 来个美美的句子
 * @rule fkxqs
 * @rule raw (^sjmjx$|^sjmt$)
 * @rule raw (https:\/\/v\.douyin\.com\/[\-a-zA-Z0-9]+)
 * @rule raw (http:\/\/xhslink\.com\/[a-z]\/[a-zA-Z0-9]+)
 * @priority 1030
 * @public true
 * @admin true
 * @disable false
 * @encrypt false
 * @class 小工具
 * @create_at 2099-01-01 10:06:00
 * @icon https://img.icons8.com/?size=100&id=XaiON9SINqn0&format=png&color=000000
 */
const axios = require('axios');
const {sender: s, Bucket, utils: {image, video}} = require('sillygirl');

const URL = 'https://api.txcnm.cn/api';

(async () => {
    const bucket = new Bucket('txcnm');
    const key = await bucket.get('token', false);
    if (!key) return await s.reply(`请先配置骄阳API的token，https://api.txcnm.cn/`);

    const content = await s.getContent();
    const platform = await s.getPlatform();

    const handlers = [
        {match: isMoyu, action: handleMoyu},
        {match: is60s, action: handle60s},
        {match: isWenMei, action: handleWenMei},
        {match: isDouyin, action: handleDouyin},
        {match: isXiaohongshu, action: handleXiaohongshu},
        {match: fkxqs, action: handleFkxqs},
        {match: (c) => ['sjmjx', 'sjmt'].includes(c), action: handleSj}
    ];

    for (const {match, action} of handlers) {
        if (match(content)) {
            await action(content, key, platform);
            break;
        }
    }
})();

// ==== 匹配函数 ====
function isMoyu(content) {
    return /^摸鱼|^moyu|^my|^摸鱼倒计时/.test(content);
}

function is60s(content) {
    return content.startsWith('60s');
}

function isWenMei(content) {
    return content.startsWith('来个美美的句子');
}

function isDouyin(content) {
    return /https:\/\/v\.douyin\.com\/[\-a-zA-Z0-9]+/.test(content);
}

function isXiaohongshu(content) {
    return /http:\/\/xhslink\.com\/[a-z]\/[a-zA-Z0-9]+/.test(content);
}

function fkxqs(content) {
    return content.startsWith('fkxqs');
}

// ==== 处理函数 ====
async function handleMoyu(_, key) {
    const url = `${URL}/tp/mydjs?key=${key}`;
    await s.reply(image(url));
}

async function handle60s(_, key) {
    const url = `${URL}/zbx/index?key=${key}`;
    await s.reply(image(url));
}

async function handleSj(content, key) {
    await s.reply(image(`${URL}/${content}/index?key=${key}`));
}

async function handleWenMei(_, key) {
    const {data: body} = await axios({
        url: `https://api.txcnm.cn/api/randtext/wm?key=${key}&type=text`,
        responseType: 'text'
    });
    await s.reply(body);
}

async function handleDouyin(content, key) {
    const url = content.match(/https:\/\/v\.douyin\.com\/[\-a-zA-Z0-9]+/)[0];
    const {data: body} = await axios({
        url: `${URL}/jxxl/dyjx?key=${key}&url=${encodeURIComponent(url)}`,
        responseType: 'json'
    });
    if (body.code === 200) {
        if (body.lx === '短视频') {
            console.log(`抖音解析成功: ${body.data.title}, ${body.data.url}`);
            await s.reply(`${body.data.title}\n${video(body.data.url)}`);
        } else if (body.lx === '图集') {
            const {title, fm, img} = body.data;
            const images = img.map(url => image(url)).join('');
            await s.reply(`${title}\n${images}`);
        } else {
            await s.reply(JSON.stringify(body));
        }
    } else {
        await s.reply(`抖音解析失败`);
    }
}

async function handleXiaohongshu(content, key) {
    const url = content.match(/http:\/\/xhslink\.com\/[a-z]\/[a-zA-Z0-9]+/)[0];
    const {data: body} = await axios({
        url: `${URL}/jxxl/xhstj?key=${key}&url=${encodeURIComponent(url)}`,
        responseType: 'json'
    });
    if (body.code === 200) {
        if (body.lx === '图集') {
            const {title, img} = body.data;
            const images = img.map(url => image(url)).join('');
            await s.reply(`${title}\n${images}`);
        } else {
            await s.reply(JSON.stringify(body));
        }
    } else {
        await s.reply(`小红书解析失败`);
    }
}

async function handleFkxqs(_, key) {
    await s.reply((await axios.get(`${URL}/randtext/fkxqs?key=${key}&type=text`)).data)
}