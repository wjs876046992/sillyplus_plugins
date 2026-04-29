global.sillygirl = require('sillygirl');
/**
 * @name 返利注册
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @description 返利注册。一套返利用户体系，记录不同渠道不同的用户信息，以及对应的渠道ID（订单跟踪ID）
 * @version v1.0.2
 * v1.0.1 增加插件描述
 * v1.0.2 优化注册备案逻辑
 * @rule 返利注册
 * @form {key: "fanli.wxpusher_token", title: "wxpusher通知token", tooltip: "wxpusher通知token", required: false}
 * @public true
 * @disable false
 * @encrypt false
 * @class 返利
 * @icon https://img.icons8.com/?size=100&id=6Tg0VHSTGfN4&format=png&color=000000
 * @create_at 2099-01-01 14:52:50
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();