/**
 * @name 京东农场
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 1.0.3
 * @description 普通用户指令：我的农场。查询我的农场种植进度。\n 普通用户指令：农场兑换。兑换红包并自动种植新作物。
 * 管理员指令：农场领取 [ql] [pin]。查询指定青龙的指定账号的农场种植进度。
 * v1.0.0 初始化版本
 * v1.0.1 适配QingLong配置
 * v1.0.3 农场接口逻辑调整
 * v1.0.4 h5st相对应升级
 * @rule ^(我的农场|农场兑换)$
 * @rule 农场领取 [ql] [pin?]
 * @form {key: "notice.farm_ql_client_id", title: "青龙client_id", tooltip: "青龙client_id，在qinglong存储器中，不填则默认取第一个"}
 * @form {key: "thresholdConfig.limit", title: "请求限流" , tooltip: "每个用户请求间隔时间（分钟），默认2min"}
 * @admin false
 * @public false
 * @priority 1010
 * @disable false
 * @encrypt false
 * @class 狗东
 * @create_at 2099-01-01 19:16:00
 * @icon https://img.icons8.com/?size=100&id=hpFrmBMxFWDx&format=png&color=000000
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();