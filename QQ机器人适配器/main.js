/**
 * @name QQ机器人适配器
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description QQ Bot 官方机器人适配器，纯 WebSocket 客户端模式。
 * @form {key: "qqbot.appId", title: "AppId", tooltip: "QQ Bot开放平台-AppId", required: true}
 * @form {key: "qqbot.appSecret", title: "AppSecret", tooltip: "QQ Bot开放平台-AppSecret", required: true}
 * @form {key: "qqbot.guild_enabled", title: "启用频道消息", valueType: 'switch', tooltip: "额外订阅频道@消息和频道私信"}
 * @public true
 * @disable false
 * @service true
 * @create_at 2099-01-01 12:10:49
 * @icon https://img.icons8.com/?size=100&id=84804&format=png
 */


const { start } = require('./modules');

!(async () => {
    await start();
})();
