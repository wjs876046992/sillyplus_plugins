/**
 * @name Pagermaid适配器
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description Pagermaid-Pyro TG 机器人适配器，提供 WebSocket 服务。
 * @form {key: "pmp.ws_reverse", title: "链接地址", tooltip: "傻妞的通讯地址用于生成插件，请如实填写", required: true}
 * @form {key: "pmp.secure_token", title: "安全Token", tooltip: "用于安全验证，自动生成。", required: true}
 * @form {key: "pmp.disable_apt_source", title: "禁用插件源", valueType: 'switch', tooltip: "对接成功后自动禁用插件源"}
 * @public true
 * @disable false
 * @service true
 * @ws /bot/pagermaid
 * @create_at 2099-01-01 12:10:49
 * @icon https://img.icons8.com/?size=100&id=84804&format=png
 */
const { start } = require('./modules');

!(async () => {
    await start();
})();
