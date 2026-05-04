global.sillygirl = require('sillygirl');
/**
 * @name 企业微信应用适配器
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description 企业微信应用机器人适配器，接收企微消息并回复。
 * @form {key: "qywxyy.token", title: "Token", tooltip: "回调配置-Token", required: true}
 * @form {key: "qywxyy.aesKeyEncoding", title: "EncodingAESKey", tooltip: "回调配置-EncodingAESKey", required: true}
 * @form {key: "qywxyy.corpid", title: "企业ID", tooltip: "开发者信息-企业ID", required: true}
 * @form {key: "qywxyy.corpsecret", title: "Secret", tooltip: "开发者信息-Secret", required: true}
 * @form {key: "qywxyy.proxy", title: "代理", tooltip: "应用上设置的可信IP的http代理", required: false}
 * @public true
 * @disable false
 * @service true
 * @http GET /api/bot/qywxyy
 * @http POST /api/bot/qywxyy
 * @create_at 2099-01-01 12:10:49
 * @icon https://img.icons8.com/?size=100&id=84804&format=png
 */


const { start } = require('./modules');

!(async () => {
    await start();
})();
