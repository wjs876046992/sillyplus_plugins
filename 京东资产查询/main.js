/**
 * @name 京东资产查询
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 1.0.7
 * @description 京东资产查询
 * 指令：查询 [序号]
 * v1.0.1 修复查询逻辑
 * v1.0.2 适配qinglong的存储方式
 * v1.0.3 提升查询效率，多账号时支持选择账号
 * v1.0.4 h5st相对应升级
 * v1.0.5 支持优先指定一个默认的ql_client_id，同“京东资产通知”
 * v1.0.5-alpha.x 调整h5st版本。解决请求403问题
 * v1.0.5-alpha.3 移除旧农场
 * v1.0.6 修复京东资产查询相关API
 * v1.0.7 适配新版API
 * @rule [cmd:查询,卡券,红包,京豆] [ql?] [pinIndex?]
 * @form {key: "notice.assert_ql_client_id", title: "青龙client_id", tooltip: "青龙client_id，在qinglong存储器中，多个用逗号分隔，不填则默认取第一个"}
 * @admin false
 * @public true
 * @priority 1010
 * @disable false
 * @encrypt false
 * @class 狗东
 * @create_at 2099-01-01 19:13:00
 * @icon https://img.icons8.com/?size=100&id=auyw7PbehiKM&format=png&color=000000
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();