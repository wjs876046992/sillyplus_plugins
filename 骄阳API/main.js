/**
 * @name 骄阳API
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.3
 * @description 骄阳API合集，只记录好玩的免费的API。
 * v1.0.1 wechat ferry 图片发送，但是需要wcf 傻妞在局域网，同时需要nginx代理，仅自用吧
 * v1.0.2 修复摸鱼倒计时和60s读懂世界的图片发送问题
 * v1.0.3 增加抖音短链、小红书解析
 * @form {key: "txcnm.token", title: "骄阳API token", required: true}
 * @rule raw (^摸鱼$|^moyu$|^my$|^摸鱼倒计时$)
 * @rule 60s
 * @rule 来个美美的句子
 * @rule raw (https:\/\/v\.douyin\.com\/[a-zA-Z0-9]+)
 * @rule raw (http:\/\/xhslink\.com\/a\/[a-zA-Z0-9]+)
 * @priority 1030
 * @public true
 * @admin true
 * @disable false
 * @encrypt false
 * @class 小工具
 * @create_at 2099-01-01 10:06:00
 * @icon https://img.icons8.com/?size=100&id=XaiON9SINqn0&format=png&color=000000
 */

const fs = require('fs'), {v4: randomUUID} = require('uuid'), path = require('path'), axios = require('axios');
const {sender: s, Bucket, console, utils: {image, video}} = require('sillygirl');

const URL = 'https://api.txcnm.cn/api'
let key;


async function downloadImage(url) {
    // 定义文件路径
    const directory = path.join('/var/www/html/sillyplus'); // 保存图片的目录
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive: true});
    }
    const filename = path.join(directory, `${randomUUID()}.jpg`);

    // 从 URL 获取二进制图片数据
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer' // 使 axios 返回二进制数据
    });

    // 获取二进制数据并转换为 Buffer
    const body = Buffer.from(response.data);

    await fs.writeFileSync(filename, body);
    console.log(`img save at: ${filename}`);
    return filename;
}

(async () => {
    key = await (new Bucket('txcnm')).get('token', false)
    if (!key) {
        return await s.reply(`请先配置骄阳API的token，https://api.txcnm.cn/`)
    }
    const content = await s.getContent()
    const platform = await s.getPlatform()

    // 摸鱼倒计时
    const is_moyu = content.startsWith('摸鱼') || content.startsWith('moyu') || content.startsWith('my') || content.startsWith('摸鱼倒计时');
    if (is_moyu) {
        const url = `${URL}/tp/mydjs?key=${key}`
        await s.reply(image(url));
        /*let filename;
        try {
            filename = await downloadImage(url);
            if (platform === 'tg') {
                await s.reply(image(filename));
                return
            }
            const sg = new Bucket('sillyGirl');
            const url2 = `http://${await sg.get('local_ip')}/sillyplus/${filename.split('/').pop()}`;
            await s.reply(image(url2));
        } catch (error) {
            console.error('Error downloading or saving image:', error);
        } finally {
            fs.unlinkSync(filename);
        }*/
        return
    }

    // 60s读懂世界
    const is_60s = content.startsWith('60s');
    if (is_60s) {
        const url = `${URL}/tp/60s?key=${key}`
        await s.reply(image(url));
        /*let filename;
        try {
            filename = await downloadImage(url);
            if (platform === 'tg') {
                await s.reply(image(filename));
                return
            }

            const sg = new Bucket('sillyGirl');
            const url2 = `http://${await sg.get('local_ip')}/sillyplus/${filename.split('/').pop()}`;
            await s.reply(image(url2));
        } catch (error) {
            console.error('Error downloading or saving image:', error);
        } finally {
            fs.unlinkSync(filename);
        }*/
        return
    }

    // 来个美美的句子
    const is_wm = content.startsWith('来个美美的句子');
    if (is_wm) {
        const {data: body} = await axios({
            url: `https://api.txcnm.cn/api/randtext/wm?key=${key}&type=text`,
            responseType: 'text'
        })
        await s.reply(body)
    }

    // 抖音短链解析
    const is_douyin = content.match(/https:\/\/v\.douyin\.com\/[a-zA-Z0-9]+/);
    if (is_douyin) {
        const url = is_douyin[0];
        const {data: body} = await axios({
            url: `${URL}/jxxl/dyjx?key=${key}&url=${encodeURIComponent(url)}`,
            responseType: 'json'
        });
        if (body.code === 200) {
            if (body.lx === '短视频') {
                const videoUrl = body.data.url;
                await s.reply(`${body.data.title}\n${video(videoUrl)}`);
            } else {
                await s.reply(JSON.stringify(body))
            }
        } else {
            await s.reply(`抖音解析失败`);
        }
    }

    // 小红书短链解析
    const is_xhs = content.match(/http:\/\/xhslink\.com\/a\/[a-zA-Z0-9]+/);
    if (is_xhs) {
        const url = is_xhs[0];
        const {data: body} = await axios({
            url: `${URL}/jxxl/xhstj?key=${key}&url=${encodeURIComponent(url)}`,
            responseType: 'json'
        });
        if (body.code === 200) {
            if (body.lx === '图集') {
                const { title, img } = body.data;
                const images = img.map(url => image(url)).join('');
                await s.reply(`${title}${images}`);
            } else {
                await s.reply(JSON.stringify(body))
            }
        } else {
            await s.reply(`小红书解析失败`);
        }
    }


})();