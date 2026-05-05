global.sillygirl = require('sillygirl');
/**
 * @name 京东账号检测
 * @origin 小白兔🐰
 * @author 落幕尽繁华
 * @version v1.0.5
 * @description 检测账号是否有效
 * v1.0.0 初始化版本
 * v1.0.1 区分通知配置
 * v1.0.2 修复通知到WxPusher时错误
 * v1.0.3 自定义账号过期登录提示
 * v1.0.4 增加通知时间段，数组。对青龙过期未禁用的账号进行禁用
 * v1.0.5 增加tg通知开关，默认开启，只发给管理员
 * @rule 账号检测
 * @form {key: "notice.account_tg", title: "tg通知开关", tooltip: "是否启用qq通知，开启后默认取qq下的admin、bot_id，通知给管理员", valueType: 'switch', default: true}
 * @form {key: "notice.account_qq", title: "qq通知开关", tooltip: "是否启用qq通知，开启后默认取qq下的admin、bot_id", valueType: 'switch'}
 * @form {key: "notice.account_wx", title: "wx通知开关", tooltip: "是否启用微信通知，开启后默认取wx下的admin、bot_id", valueType: 'switch'}
 * @form {key: "notice.account_WxPusher", title: "WxPusher通知开关", tooltip: "是否启用WxPusher通知", valueType: 'switch', default: false}
 * @form {key: "notice.account_WxPusher_token", title: "WxPusher token", tooltip: "关注WxPusher消息推送平台获取"}
 * @form {key: "notice.account_WxPusher_admin_uid", title: "WxPusher 管理员ID", tooltip: "WxPusher管理员UID，也就是你的UID，不填则不推送给其他未关联的用户"}
 * @form {key: "notice.account_ql_client_id", title: "青龙client_id", tooltip: "青龙client_id，在qinglong存储器中，多个用逗号分隔，不填则默认取第一个"}
 * @form {key: "notice.account_notice_hours", title: "通知时间段", tooltip: "通知时间段，数组，如[8, 12, 20]，表示当前时间“小时”是8、12、20时通知"}
 * @form {key: "jd_cookie.rabbit_pro_login_tip", title: "账号过期登录提示", tooltip: "账号过期登录提示", default: false}
 * @public true
 * @admin false
 * @disable false
 * @encrypt false
 * @class 狗东
 * @create_at 2099-01-01 19:17:00
 * @icon https://img.icons8.com/?size=100&id=uZ8RFAi12S1D&format=png&color=000000
 */
const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();