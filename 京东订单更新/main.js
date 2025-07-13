/**
 * @name 京东订单更新
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.2
 * @description 京东订单更新。根据订单更新时间，每分钟同步一次，查询京东订单状态，更新到数据库。
 * v1.0.1 修复丢失返佣比例的问题
 * v1.0.2 增加京东联盟 APP_KEY 和 APP_SECRET 配置
 * @form {key: "fanli.tb_zhetaoke_appkey", "title": "折淘客APP_KEY", tooltip: "折淘客的对接秘钥appkey", required: true}
 * @form {key: "fanli.jd_union_app_key", "title": "京东联盟 APP_KEY", required: true}
 * @form {key: "fanli.jd_union_app_secret", "title": "京东联盟 APP_SECRET", required: true}
 * @cron 1 * * * * *
 * @public true
 * @disable false
 * @encrypt false
 * @class 返利
 * @icon https://img.icons8.com/?size=100&id=I6VLjzP2zwQR&format=png&color=000000
 * @create_at 2099-01-01 14:49:50
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();