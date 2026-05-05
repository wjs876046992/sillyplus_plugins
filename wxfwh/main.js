global.sillygirl = require('sillygirl');
/**
 * @name 微信服务号适配器
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description 微信服务号机器人适配器，接收消息并回复。
 * @form {key: "wxfwh.token", title: "Token", tooltip: "回调配置-Token", required: true}
 * @form {key: "wxfwh.aesKeyEncoding", title: "EncodingAESKey", tooltip: "回调配置-EncodingAESKey", required: true}
 * @form {key: "wxfwh.ghid", title: "公众号/服务号ID", tooltip: "开发者信息-企业ID", required: true}
 * @form {key: "wxfwh.appid", title: "开发者ID(AppID)", tooltip: "开发者信息-企业ID", required: true}
 * @form {key: "wxfwh.appsecret", title: "开发者密码(AppSecret)", tooltip: "开发者信息-Secret", required: true}
 * @form {key: "wxfwh.proxy", title: "代理", tooltip: "公众号/服务号上设置的可信IP的http代理", required: false}
 * @public true
 * @disable false
 * @service true
 * @http ANY /api/bot/wxfwh
 * @create_at 2099-01-01 12:10:49
 * @icon https://img.icons8.com/?size=100&id=84804&format=png
 */


const { start } = require('./modules');

!(async () => {
    await start();
})();
