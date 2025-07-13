/**
 * @name Gewechat微信机器人
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 1.0.2
 * @description Gewechat适配器。依赖HTTP机器人适配器插件。
 * v1.0.0 init
 * v1.0.1 修复联系人超过100查询失败问题
 * v1.0.2 修复新版Gewechat推送消息问题
 * @rule [指令前缀:gewe] [类目] [callback?]
 * @form {key: "web_service.gewe_enabled", title: "启用Gewechat适配器", tooltip: "默认不启用", required: false, valueType: 'switch'}
 * @form {key: "gewe.gewe_host", title: "Gewechat机器人HTTP地址", required: true}
 * @form {key: "gewe.gewe_appid", title: "Gewechat appId", tooltip: "初次使用时无此字段，新的微信号时也会重置", required: false}
 * @form {key: "gewe.gewe_token", title: "Gewechat token", tooltip: "用于请求API的鉴权信息，初次使用时自动生成", required: false}
 * @public true
 * @admin true
 * @disable false
 * @encrypt false
 * @service true
 * @class 机器人 微信
 * @create_at 2099-01-01 20:18:00
 * @icon https://img.icons8.com/?size=100&id=Pf58cYAglhKN&format=png&color=000000
 */
const {sender: s} = require('sillygirl');
const {
    start, login, callback
} = require('./modules');



(async () => {
    const plt = await s.getPlatform();
    if (plt === "*") {
        await start()
    } else {
        const type = await s.param("类目");
        if (type === '登录') {
            // 登录
            await login()
        } else if (type === '回调') {
            const url = await s.param("callback")
            const urlRegex = /^(https?:\/\/)?(([\da-z.-]+)|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[\/\w .-]*)*(\?[;&a-z\w%_+=-]*)?(#[a-z\w_-]*)?$/i;
            if (!url || !urlRegex.test(url)) {
                await s.reply('回调地址设置错误！')
                return
            }
            await callback(url)
        } else if (type === '教程') {
            // 写点文字说明
            await s.reply(`
Gewechat 是一个免费开源的微信个人号框架，支持二次开发，提供 Restful API 接口，开发者可以通过该框架实现微信的自动化功能，如登录、消息收发、好友管理、群管理等。其优势在于无需安装电脑版微信或手机破解插件，只需扫码登录即可使用，操作简单且稳定性高\n

下面是 Gewechat 的安装步骤：
1、拉取并运行 Gewechat 镜像
拉取 Gewechat 镜像：
docker pull registry.cn-hangzhou.aliyuncs.com/gewe/gewe:latest
docker tag registry.cn-hangzhou.aliyuncs.com/gewe/gewe gewe

运行容器：
mkdir -p /root/temp
docker run -itd -v /root/temp:/root/temp -p 2531:2531 -p 2532:2532 --privileged=true --name=gewe gewe /usr/sbin/init

设置容器开机自启：
docker update --restart=always gewe\n
2、「docker logs -f gewe」查看日志，若出现错误“Failed to allocate manager object, freezing.”看 https://github.com/Devo919/Gewechat/issues/9 解决
3、管理员给傻妞发送指令：「gewe 登录」。登录并注册适配器
4、管理员给傻妞发送指令：「gewe 回调 http://{傻妞地址}:{HTTP插件端口}/api/bot/gewechat 」。给gewe注册回调地址，其中xxx是HTTP插件的端口。
5、好了，愉快的玩耍吧～.～\n
PS: 傻妞Gewechat微信机器人插件依赖HTTP机器人适配器插件,请先安装并启动HTTP机器人适配器插件
            `)
        }
    }
})();