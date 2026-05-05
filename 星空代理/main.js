/**
 * @name 星空代理签到
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.2
 * @description 星空代理签到
 * v1.0.1 调整注释
 * v1.0.2 增加tg通知
 * @form {key: "xkdaili.username", title: "用户名", required: true}
 * @form {key: "xkdaili.password", title: "密码", required: true}
 * @rule 星空代理签到
 * @public false
 * @admin true
 * @class 签到
 * @create_at
 * @create_at 2099-01-01 10:08:00
 * @icon https://img.icons8.com/?size=100&id=XLIuxTGpTMJ1&format=png&color=000000
 */

const axios = require('axios'), qs = require('qs');
const {sender: s, Bucket, sleep, Adapter, console} = require('sillygirl');

let username
let password

const toParams = (param) => {
    let result = ""
    for (let name in param) {
        if (typeof param[name] != 'function') {
            result += "&" + name + "=" + encodeURIComponent(param[name]);
        }
    }
    return result.substring(1)
}

const extractSetCookie = (headers) => {
    let cks
    if (!headers || !(cks = headers['set-cookie'])) {
        return
    }

    let c = ''
    for (const ck of headers['set-cookie']) {
        c += `${ck.split(';')[0]}; `
    }
    return c
}

const login = async () => {

    if (!password || !username) {
        console.error(`未配置用户名密码`)
        process.exit()
    }

    const options = {
        method: 'POST',
        url: 'https://www.xkdaili.com/tools/submit_ajax.ashx?action=user_login&site_id=1',
        headers: {
            authority: 'www.xkdaili.com',
            accept: 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            origin: 'https://www.xkdaili.com',
            referer: 'https://www.xkdaili.com/',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81',
            'x-requested-with': 'XMLHttpRequest'
        },
        data: qs.stringify({
            username,
            password,
            remember: 1,
            code: ""
        }),
        responseType: 'text'
    }
    console.debug(arguments.callee.name, JSON.stringify(options))
    const {status: statusCode, headers, data: body} = await axios(options)
    console.debug(arguments.callee.name, body)
    if (statusCode !== 200) {
        process.exit()
    }

    const data = JSON.parse(body)
    if (data.status !== 1) {
        console.debug(arguments.callee.name, body)
        process.exit()
    }

    const ck = extractSetCookie(headers)
    if (!ck) {
        console.debug(arguments.callee.name, headers)
        process.exit()
    }
    console.debug(arguments.callee.name, ck)
    return ck;
}

const sign = async () => {

    const cookie = await login()
    const options = {
        'method': 'POST',
        'url': 'https://www.xkdaili.com/tools/submit_ajax.ashx?action=user_receive_point',
        'headers': {
            authority: 'www.xkdaili.com',
            accept: 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            origin: 'https://www.xkdaili.com',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15',
            referer: 'https://www.xkdaili.com/main/usercenter.aspx',
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: 'type=login',
        responseType: 'text'
    }
    const {data: body} = await axios(options)
    // await s.reply(`【${username}】\nMacGege签到结果\n${JSON.stringify(JSON.parse(body))}`)
    console.debug(arguments.callee.name, options, body)
    return JSON.parse(body)
}

const getBotAndMaster = async (platform = 'tg') => {
    const x = new Bucket(platform)
    let bot_id = await x.get('bot_id', false)
    if (!bot_id && platform === 'tg') {
        // 兼容tgBot
        const token = await x.get('token')
        bot_id = token.split(':')[0]
    }
    const adminStr = await x.get('masters', false)
    let admin = adminStr && adminStr.indexOf('&') === 0 ? adminStr.split('&')[1] : adminStr.split('&')[0]
    return {bot_id, admin, platform}
}

~(async () => {
    const xk = new Bucket('xkdaili')
    const usernames = (await xk.get('username') || '').split('&')
    const passwords = (await xk.get('password') || '').split('&')
    const size = usernames.length

    const messages = [];
    for (let index = 0; index < size; index++) {
        username = usernames[index]
        password = passwords[index]
        const ret = await sign()
        await sleep(1400)
        messages.push(`【${username}】\n星空代理签到结果\n${JSON.stringify(ret)}`)
    }
    if (messages.length === 0) {
        return
    }

    const isCron = !!(await s.getMessageId());
    if (isCron) {
        const botConfig = await getBotAndMaster();
        console.log(JSON.stringify(botConfig))
        await (new Adapter(botConfig)).push({
            user_id: botConfig.admin,
            content: messages.join('\n\n')
        });
    } else {
        await s.reply(messages.join('\n\n'))
    }
})();