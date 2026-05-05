global.sillygirl = require('sillygirl');
/**
 * @name 企业微信客服适配器
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description 企业微信客服机器人适配器，接收消息并回复。
 * @form {key: "qywxkf.token", title: "Token", tooltip: "回调配置-Token", required: true}
 * @form {key: "qywxkf.aesKeyEncoding", title: "EncodingAESKey", tooltip: "回调配置-EncodingAESKey", required: true}
 * @form {key: "qywxkf.corpid", title: "企业ID", tooltip: "开发者信息-企业ID", required: true}
 * @form {key: "qywxkf.corpsecret", title: "Secret", tooltip: "开发者信息-Secret", required: true}
 * @public true
 * @disable false
 * @service true
 * @http GET /api/bot/qywxkf
 * @http POST /api/bot/qywxkf
 * @create_at 2099-01-01 12:10:49
 * @icon https://img.icons8.com/?size=100&id=84804&format=png
 */


const { start } = require('./modules');

!(async () => {
    await start();
})();
