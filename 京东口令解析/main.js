/**
 * @name 京东口令解析
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.3
 * v1.0.1 京东口令解析修改匹配的正则。
 * v1.0.2 京东口令解析修改匹配的正则，支持10位的口令。
 * v1.0.3 使用CQ码传递回复内容
 * @description 京东口令解析。指令：jdx 京东口令解析。 指令：fl 回复消息fl获取返利。 指令：jdx 回复消息jdx获取解析内容。
 * @rule raw ^jdx .+
 * @rule (CQ:reply,)
 * @priority 1003
 * @public true
 * @admin true
 * @disable false
 * @encrypt false
 * @class 狗东
 * @create_at 2099-01-01 19:14:00
 * @icon https://img.icons8.com/?size=100&id=_XNKVIY_bkGK&format=png&color=000000
 */

const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();