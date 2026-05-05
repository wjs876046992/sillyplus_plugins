global.sillygirl = require('sillygirl');
/**
 * @name 京东账号管理
 * @origin 小白兔🐰
 * @author 落幕尽繁华
 * @version v1.0.2
 * @description 管理账号
 * v1.0.1 删除最后一个账号时删除用户信息
 * v1.0.2 一点小问题修复
 * @rule raw (^我的账号$|^账号管理$|^管理账号$)
 * @form {key: "notice.account_ql_client_id", title: "青龙client_id", tooltip: "青龙client_id，在qinglong存储器中，多个用逗号分隔，不填则默认取第一个"}
 * @public true
 * @admin false
 * @disable false
 * @encrypt false
 * @class 狗东
 * @create_at 2099-01-01 19:18:00
 * @icon https://img.icons8.com/?size=100&id=LqCUTJ97SNo6&format=png&color=000000
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();