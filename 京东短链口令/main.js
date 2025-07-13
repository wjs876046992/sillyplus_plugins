/**
 * @name 京东短链口令
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.1
 * @description 京东短链口令
 * v1.0.1 bigfix: 消息种存在换行时解析失败问题
 * @rule raw ^dwz (.+)
 * @rule raw ^kl (.+)
 * @priority 1002
 * @public true
 * @admin true
 * @disable false
 * @encrypt false
 * @class 狗东
 * @create_at 2099-01-01 19:15:00
 * @icon https://img.icons8.com/?size=100&id=JfN1N3SPMj14&format=png&color=000000
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();