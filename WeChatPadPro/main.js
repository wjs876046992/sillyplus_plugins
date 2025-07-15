/**
 * @name WeChatPadPro微信机器人
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 1.0.1
 * @description WeChatPadPro适配器。依赖HTTP机器人适配器插件。
 * v1.0.0 init
 * v1.0.1 依然是websocket，支持wechat 8.0.61，增加自动重连
 * @form {key: "wcpp.enabled", title: "启用WeChatPadPro适配器", tooltip: "默认不启用", required: false, valueType: 'switch'}
 * @form {key: "wcpp.wcpp_host", title: "WeChatPadPro机器人HTTP地址", tooltip: "需包含apiVersion路径", required: true}
 * @form {key: "wcpp.wcpp_admin_key", title: "WeChatPadPro 管理员Key", tooltip: "用于请求管理员的API，暂未支持自动生成auth key", required: false}
 * @form {key: "wcpp.wcpp_auth_key", title: "WeChatPadPro 普通Key", tooltip: "代表一个登录设备", required: true}
 * @public true
 * @disable false
 * @encrypt false
 * @service true
 * @class 机器人 微信
 * @create_at 2099-01-01 20:18:01
 * @icon https://img.icons8.com/?size=100&id=dyn1q9BZjBe0&format=png&color=000000
 */
const {Bucket, console} = require('sillygirl');
const modules = require('./modules');

(async () => {
    // 检查是否启用 WeChatPadPro 适配器
    const platform = 'wcpp';
    const wcpp = new Bucket(platform);
    const enabled = await wcpp.get('enabled', false);
    if (!enabled) {
        console.info('WeChatPadPro 适配器未启用');
        return;
    }
    // 获取配置参数
    const wcpp_host = await wcpp.get('wcpp_host');
    const wcpp_auth_key = await wcpp.get('wcpp_auth_key');
    const wcpp_admin_key = await wcpp.get('wcpp_admin_key');

    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module(wcpp_host, wcpp_auth_key, wcpp_admin_key, platform);  // 执行模块
        }
    }
})();