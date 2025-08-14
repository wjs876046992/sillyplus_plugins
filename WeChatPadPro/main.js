/**
 * @name WeChatPadPro微信机器人
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 1.0.3
 * @description WeChatPadPro适配器。依赖HTTP机器人适配器插件。
 * v1.0.0 init
 * v1.0.1 依然是websocket，支持wechat 8.0.61，增加自动重连
 * v1.0.2 websocket和webhook两种模式，二选一
 * v1.0.3 代码重构，增加重启指令
 * @rule [指令前缀:wcpp] [分类]
 * @form {key: "wcpp.enabled_websocket", title: "启用WeChatPadPro适配器websocket", tooltip: "默认不启用", required: false, valueType: 'switch'}
 * @form {key: "wcpp.enabled_webhook", title: "启用WeChatPadPro适配器webhook", tooltip: "默认不启用", required: false, valueType: 'switch'}
 * @form {key: "wcpp.wcpp_host", title: "WeChatPadPro机器人HTTP地址", tooltip: "需包含apiVersion路径", required: true}
 * @form {key: "wcpp.wcpp_admin_key", title: "WeChatPadPro 管理员Key", tooltip: "用于请求管理员的API，暂未支持自动生成auth key", required: false}
 * @form {key: "wcpp.wcpp_auth_key", title: "WeChatPadPro 普通Key", tooltip: "代表一个登录设备", required: true}
 * @form {key: "wcpp.need_group_at", title: "是否需要群聊@", tooltip: "是否仅仅处理群聊中的@消息", required: false, valueType: 'switch', default: false}
 * @public true
 * @disable false
 * @encrypt false
 * @service true
 * @class 机器人 微信
 * @create_at 2099-01-01 20:18:01
 * @icon https://img.icons8.com/?size=100&id=dyn1q9BZjBe0&format=png&color=000000
 */
const {Adapter, Bucket, sender: s, console, sleep} = require('sillygirl');
const {webhook, websocket} = require("./modules");

const restart = async () => {
    // 检查是否启用 WeChatPadPro 适配器
    const platform = 'wcpp';
    const wcpp = new Bucket(platform);

    const enabled_websocket = await wcpp.get('enabled_websocket', false);
    const enabled_webhook = await wcpp.get('enabled_webhook', false);
    if (!enabled_websocket && !enabled_webhook) {
        console.info('WeChatPadPro 适配器未启用');
        return;
    }
    // 获取配置参数
    const wcpp_host = await wcpp.get('wcpp_host');
    const wcpp_auth_key = await wcpp.get('wcpp_auth_key');
    const wcpp_admin_key = await wcpp.get('wcpp_admin_key');
    if (!wcpp_host || !wcpp_auth_key || !wcpp_admin_key) {
        console.error('WeChatPadPro 适配器配置不完整，请检查 wcpp_host, wcpp_auth_key, wcpp_admin_key');
        return;
    }
    if (enabled_websocket) {
        console.info('WeChatPadPro 适配器 WebSocket 模块正在初始化...');
        await websocket(wcpp_host, wcpp_auth_key, wcpp_admin_key, platform);
    } else if (enabled_webhook) {
        console.info('WeChatPadPro 适配器 Webhook 模块正在初始化...');
        await webhook(wcpp_host, wcpp_auth_key, wcpp_admin_key, platform);
    }
}

(async () => {
    const plt = await s.getPlatform();
    const c = await s.param('分类');
    console.debug(`WeChatPadPro适配器指令：平台=${plt}, 分类=${c}`);
    if (plt === '*' || c === '重启') {
        await restart();
        if (c === '重启') {
            // 发送重启消息
            console.debug('WeChatPadPro适配器正在重启...');
            const id = await s.reply('WeChatPadPro适配器已重启');
            const m_id = await s.getMessageId();
            await sleep(2000); // 等待2秒
            await s.doAction({
                type: 'delete_message',
                message_ids: [id, m_id]
            })
        }
    }
})();