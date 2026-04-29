global.sillygirl = require('sillygirl');
/**
 * @name 钉钉企业机器人
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.1
 * @description 钉钉企业内部机器人。参考文档：https://open.dingtalk.com/document/orgapp/robot-receive-message
 * v1.0.0 接收&回复文本消息
 * v1.0.1 增加回复图片消息和消息撤回功能
 * @form {key: "dingtalk.enabled", title: "是否启用钉钉机器人", valueType: "switch", required: true}
 * @form {key: "dingtalk.client_id", title: "Client ID (原 AppKey 和 SuiteKey)", required: true}
 * @form {key: "dingtalk.client_secret", title: "Client Secret (原 AppSecret 和 SuiteSecret)", required: true}
 * @public true
 * @disable false
 * @encrypt false
 * @service true
 * @class 机器人
 * @create_at 2099-01-01 20:17:00
 * @icon https://img.icons8.com/?size=100&id=fxeYQDO0hqCx&format=png&color=000000
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();