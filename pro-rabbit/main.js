/**
 * @name rabbit-pro
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.1.4
 * @description 京东登录插件，需要先有Rabbit服务。支持短信登录、扫码登录、口令登录、ck登录、账号密码登录。若是使用ck登录，则需要安装并配置好官方插件“QingLong”。
 * v1.0.2 修复配置容器ID逻辑，初次使用时提示选择容器
 * v1.0.3 增加开关：登录完后是否立即同步ck
 * v1.0.4 验证码错误支持重新输入
 * v1.0.5 支持直接输入ck登录
 * v1.0.6 支持容器变化时，重新选择容器
 * v1.0.7 指令调整
 * v1.0.8 常规更新
 * v1.0.8-alpha.1 轮询异常处理
 * v1.1.0 增加账号密码登录
 * v1.1.1 账号密码风险时二维码发送失败问题
 * v1.1.2 feat: 账号密码登录支持短信二次验证
 * v1.1.2-alpha.1 feat: 账号密码登录支持语音验证码二次验证
 * v1.1.2-alpha.2 feat: 自动图形验证最大次数后提示
 * v1.1.3 feat: 手动进行账号密码登录后，自动同步配置的ql容器
 * v1.1.4 fix ck login
 * @rule ^网页(登陆|登录)$
 * @rule ^(登陆|登录)$
 * @rule ^扫码(登陆|登录)$
 * @rule ^口令(登陆|登录)$
 * @rule ^(账号密码|账密)(登陆|登录)$
 * @rule raw pt_key=([^;]+);.*?pt_pin=([^;]+)|pt_pin=([^;]+);.*?pt_key=([^;]+)
 * @form {key: "jd_cookie.rabbit_pro_addr", title: "服务器地址" , tooltip: "rabbit_pro的服务器地址", required: true}
 * @form {key: "jd_cookie.rabbit_pro_token", title: "Bot Api Token", tooltip: "rabbit_pro的配置文件里找BotApiToken", required: true}
 * @form {key: "jd_cookie.rabbit_pro_container_id", title: "容器ID", tooltip: "后台管理-容器管理，不清楚是什么就不配（需要重置就改为空），登录时会提示选择", required: false}
 * @form {key: "jd_cookie.rabbit_pro_sync", title: "同步ck开关", tooltip: "登录成功后是否立即触发同步，此操作是配合同步CK插件使用，将来源青龙的CK同步到目标青龙", valueType: "switch", default: false}
 * @public true
 * @priority 1008
 * @disable false
 * @encrypt false
 * @class Rabbit
 * @create_at 2099-01-01 19:19:59
 * @icon https://www.svgrepo.com/show/398149/rabbit-face.svg
 */
global.sillygirl = require('sillygirl');
const modules = require('./modules');

!(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();