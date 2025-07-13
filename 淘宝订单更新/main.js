/**
 * @name 淘宝订单更新
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.2
 * @description 淘宝订单更新。根据订单更新时间，每分钟同步一次，查询淘宝订单状态，更新到数据库。
 * v1.0.1 修复丢失返佣比例的问题
 * v1.0.2 ztk订单查询接口变动查询
 * @cron 1 * * * * *
 * @public true
 * @disable false
 * @encrypt false
 * @class 返利
 * @icon https://img.icons8.com/?size=100&id=Npot870xd7C3&format=png&color=000000
 * @create_at 2099-01-01 14:48:50
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();