global.sillygirl = require('sillygirl');
/**
 * @name 京东资产通知
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 1.0.8
 * @description 配合计划任务，定时推送京东资产通知
 * v1.0.1 修复查询逻辑，仅通知到wxpusher账号，需要在青龙备注里配置了UID
 * v1.0.2 适配qinglong的存储方式
 * v1.0.3 增加wx，qq通知方式
 * v1.0.4 提升查询性能，取消sleep
 * v1.0.5 h5st相对应升级
 * v1.0.5-alpha.1 调整h5st版本。解决请求403问题
 * v1.0.5-alpha.3 移除旧农场
 * v1.0.6 修复京东资产查询相关API
 * v1.0.7 增加忽略的京东PIN
 * v1.0.8 适配新版API
 * @rule 资产通知
 * @form {key: "notice.assert_qq", title: "qq通知开关", tooltip: "是否启用qq通知，开启后默认取qq下的admin、bot_id", valueType: 'switch'}
 * @form {key: "notice.assert_wx", title: "wx通知开关", tooltip: "是否启用微信通知，开启后默认取wx下的admin、bot_id", valueType: 'switch'}
 * @form {key: "notice.assert_WxPusher", title: "WxPusher通知开关", tooltip: "是否启用WxPusher通知", valueType: 'switch', default: false}
 * @form {key: "notice.assert_WxPusher_token", title: "WxPusher token", tooltip: "关注WxPusher消息推送平台获取"}
 * @form {key: "notice.assert_WxPusher_admin_uid", title: "WxPusher 管理员ID", tooltip: "WxPusher管理员UID，也就是你的UID，不填则不推送给其他未关联的用户"}
 * @form {key: "notice.assert_ql_client_id", title: "青龙client_id", tooltip: "青龙client_id，在qinglong存储器中，多个用逗号分隔，不填则默认取第一个"}
 * @form {key: "notice.assert_ignore_jd_pins", title: "忽略京东PIN", tooltip: "不推送的京东PIN，多个用逗号分隔"}
 * @admin true
 * @public true
 * @priority 1010
 * @disable false
 * @encrypt false
 * @class 狗东
 * @icon https://img.icons8.com/?size=100&id=n0gchOyFWVEI&format=png&color=000000
 * @create_at 2099-01-01 19:12:00
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();