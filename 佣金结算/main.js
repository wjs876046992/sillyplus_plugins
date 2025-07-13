/**
 * @name 佣金结算
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.1
 * @description 每月21号计算每个渠道（京东、淘宝、拼多多）每个用户的佣金
 * v1.0.1 bugfix: 定时任务时间错误
 * @cron 10 0 0 21 * *
 * @public true
 * @disable false
 * @encrypt false
 * @class 返利
 * @icon https://img.icons8.com/?size=100&id=2rigFAICKiDz&format=png&color=000000
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