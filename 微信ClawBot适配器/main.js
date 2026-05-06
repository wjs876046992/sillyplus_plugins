/**
 * @name 微信ClawBot适配器
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description ilink-wechat 独立服务适配器，接收微信消息并回复。搭配https://github.com/ntwck/ilink-wechat使用
 * @form {key: "ilink.auth_token", title: "认证Token", tooltip: "可选，ilink请求时带在Authorization头中的token", required: false}
 * @form {key: "ilink.callback_url", title: "异步回调地址", tooltip: "异步模式下ilink的回调服务地址", required: false}
 * @form {key: "ilink.callback_auth_token", title: "异步回调认证Token", tooltip: "可选，回调时放在Authorization头中的token", required: false}
 * @public true
 * @disable false
 * @http GET /api/bot/ilink
 * @http POST /api/bot/ilink
 * @create_at 2099-01-01 12:10:49
 * @icon https://img.icons8.com/?size=100&id=84804&format=png
 */


const { start } = require('./modules');

!(async () => {
    await start();
})();
