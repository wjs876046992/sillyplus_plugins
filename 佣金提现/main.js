global.sillygirl = require('sillygirl');
/**
 * @name 佣金提现
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.2
 * v1.0.1 文案调整
 * v1.0.1-alpha 拼多多用户取错
 * v1.0.2 佣金提现、返利信息返回优化
 * @description 佣金提现。结算后的佣金进行提现，人工转账。
 * @rule 我的返利
 * @rule 佣金提现
 * @public true
 * @disable false
 * @encrypt false
 * @class 返利
 * @icon https://img.icons8.com/?size=100&id=DsXc8K8_K2H9&format=png&color=000000
 * @create_at 2099-01-01 14:44:50
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();