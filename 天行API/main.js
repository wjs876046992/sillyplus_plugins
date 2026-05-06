/**
 * @name 天行API
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.2
 * @description 天行API合集，只记录好玩的免费的API。需要申请key https://www.tianapi.com/
 * v1.0.0 数字转大写
 * v1.0.1 车牌归属地
 * v1.0.2 每日好句
 * @form {key: "txcnm.token", title: "天行API token", required: true}
 * @rule raw ^z \d+(?:\.\d{1,2})?$
 * @rule raw ^[黑吉辽冀甘青陕豫鲁晋皖鄂湘苏川黔滇浙赣粤闽台琼新蒙宁桂藏京沪津渝港澳][A-Za-z]$
 * @rule 每日好句
 * @public true
 * @admin false
 * @disable false
 * @encrypt false
 * @class 小工具
 * @create_at 2099-01-01 10:07:00
 * @icon https://img.icons8.com/?size=100&id=11219&format=png&color=907b31
 */

const axios = require('axios');
const {sender: s, Bucket, utils: {image}} = require('sillygirl');

~(async () => {
    const key = await (new Bucket('tianapi')).get('key')
    if (!key) {
        return await s.reply(`请先配置天行API的token，https://www.tianapi.com/`)
    }
    const content = await s.getContent()
    const is_z = content.match(/^z \d+(?:\.\d{1,2})?$/);

    if (is_z) {
        const money = content.slice(2)
        const {data} = await axios(`https://apis.tianapi.com/cnmoney/index?key=${key}&money=${money}`)

        await s.reply(`${data.result.cnresult}`)
        return;
    }

    const is_che = content.match(/^[黑吉辽冀甘青陕豫鲁晋皖鄂湘苏川黔滇浙赣粤闽台琼新蒙宁桂藏京沪津渝港澳][A-Za-z]$/);
    if (is_che) {
        const {data} = await axios(`https://apis.tianapi.com/chepai/index?key=${key}&word=${encodeURIComponent(content)}`)
        if (data.code !== 200) {
            return await s.reply(`未查到车牌归属地信息`)
        }

        await s.reply(`${data.result.province}${data.result.city}(${data.result.citycode})`)
        return;
    }

    const is_mrhj = content === '每日好句'
    if (is_mrhj) {
        const {data} = await axios(`https://apis.tianapi.com/one/index?key=${key}`)
        if (data.code !== 200) {
            return
        }
        const {word, wordfrom, imgurl} = data.result
        let imgMsgId
        if (imgurl) {
            imgMsgId = await s.reply(image(imgurl))
        }
        if (wordfrom) {
            await s.reply(`${word}\n- ${wordfrom}`)
        } else {
            await s.reply(word)
        }
        return;
    }

})()