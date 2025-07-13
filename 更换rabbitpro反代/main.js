/**
 * @name 更换rabbitpro反代
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.1
 * v1.0.1 增加非cron模式下的回复
 * @description 检查反代列表，更换可用的rabbitpro反代。搬运自小九九的“更换rabbitpro反代”
 * @rule ^(ghfd)$
 * @form {key: "jd_cookie.rabbit_pro_addr", title: "服务器地址" , tooltip: "rabbit_pro的服务器地址", required: true}
 * @form {key: "jd_cookie.rabbit_pro_username", title: "后台用户名", tooltip: "后台用户名", required: true}
 * @form {key: "jd_cookie.rabbit_pro_password", title: "后台密码", tooltip: "后台密码", required: true}
 * @form {key: "jd_cookie.rabbit_pro_cf_addr", title: "反代地址", tooltip: "已内置常用反代。英文逗号分割，不需要http或https，示例：rabbit.cfyes.tech,mr-orgin.1888866.xyz", required: false}
 * @cron 0 0 4 * * *
 * @admin true
 * @public true
 * @class Rabbit 搬运
 * @create_at 2099-01-01 19:19:40
 * @icon https://img.icons8.com/?size=100&id=pnm5tzJPtvXY&format=png&color=000000
 */
const {
    Bucket, console, sender: s
} = require("sillygirl");
const axios = require("axios");

const jd_cookie = new Bucket("jd_cookie");

let urlArr = [
    "mr-orgin.1888866.xyz",
    "jd-orgin.1888866.xyz",
    "mr.yanyuwangluo.cn",
    "mr.118918.xyz",
    "host.257999.xyz",
    "log.madrabbit.eu.org",
    "62.204.54.137:4566",
    "fd.gp.mba:6379",
    "fd.lc.mba:6379"
]; //反代列表

(async () => {

    const rabbit_pro_cf_running = await jd_cookie.get("rabbit_pro_cf_running", false);
    const baseUrl = await jd_cookie.get("rabbit_pro_addr");
    const name = await jd_cookie.get("rabbit_pro_username");
    const passwd = await jd_cookie.get("rabbit_pro_password");
    const cfAddr = await jd_cookie.get("rabbit_pro_cf_addr", "");
    if (cfAddr) {
        urlArr = cfAddr.split(",");
    }
    console.debug(`baseUrl: ${baseUrl}, name: ${name}, passwd: ${passwd}, cfAddr: ${cfAddr}`);
    const needReply = (await s.getPlatform()) !== "cron";

    if (!baseUrl || !name || !passwd) {
        console.log("更换rabbit pro反代：请先填写服务器地址、用户名、密码");
        needReply && await s.reply("更换rabbit pro反代：请先填写服务器地址、用户名、密码");
        return
    }

    if (rabbit_pro_cf_running) {
        console.log("更换rabbit pro反代：另一个自动更换反代正在运行中");
        needReply && await s.reply("更换rabbit pro反代：另一个自动更换反代正在运行中");
        return
    }

    await jd_cookie.set("rabbit_pro_cf_running", true);
    const regBaseUrl = regHttpUrl(baseUrl);
    const authToken = await auth(name, passwd);
    if (!authToken) return;
    let config = await getConfig(authToken);
    if (!config) return;

    // 先检查当前配置的是否可用
    const curServerHost = config.ServerHost;
    let availUrl = await testAvailUrl(authToken, [curServerHost]);
    if (availUrl) {
        console.debug(`当前配置可用：${curServerHost}`);
        needReply && await s.reply(`当前配置可用：${curServerHost}`);
        return
    }

    availUrl = await testAvailUrl(authToken, urlArr);
    if (!availUrl) return;
    config.ServerHost = availUrl;
    await saveConfig(authToken, config);

    async function auth(name, passwd) {
        const {data: result} = await axios({
            method: "post",
            url: regBaseUrl + "/admin/auth",
            data: {username: name, password: passwd},
            responseType: "json",
        });
        console.debug(`auth result: ${JSON.stringify(result)}`);
        if (!result) {
            return;
        } else if (result.code === 401) {
            // 给管理员发送通知
        }
        return result.access_token;
    }

    async function getConfig(authToken) {
        const {data: result} = await axios({
            method: "get",
            url: regBaseUrl + "/admin/GetConfig",
            headers: {
                Authorization: "Bearer " + authToken,
            },
        })
        console.debug(`getConfig result: ${JSON.stringify(result)}`);
        if (!result) {
            return;
        }
        return result;
    }

    async function saveConfig(authToken, config) {
        const {data: result} = await axios({
            method: "post",
            url: regBaseUrl + "/admin/SaveConfig",
            headers: {
                Authorization: "Bearer " + authToken,
            },
            data: config,
        });
        console.debug(`saveConfig result: ${JSON.stringify(result)}`);
        if (result?.code === 0) {
            // 给管理员发送通知，cf切换成功
        } else {
            // 给管理员发送通知，cf切换失败
        }
    }

    async function testAvailUrl(authToken, urlArr) {
        urlArr = shuffleArray(urlArr);
        for (let url of urlArr) {
            const regUrl = regHttpUrl(url);
            const {data: result} = await axios({
                method: "post",
                url: regBaseUrl + "/admin/TestServerHost",
                headers: {
                    Authorization: "Bearer " + authToken,
                },
                data: {
                    ServerHost: regUrl,
                },
                responseType: "json",
            });
            console.debug(`test [${url}] result. success: ${result.success}, msg: ${result.msg}`);
            if (result.success) {
                return url;
            }
            console.log("无可用反代地址!")
            needReply && await s.reply("无可用反代地址!");
        }
    }

    /**
     * 随机打乱数组
     * @param array
     * @returns {*}
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // 使用ES6的解构赋值进行交换
        }
        return array;
    }

    /**
     * 正则匹配http/https
     * @param url
     * @returns {string}
     */
    function regHttpUrl(url) {
        const httpReg = /^https?:\/\//;
        if (!httpReg.test(url)) {
            url = "http://" + url;
        }
        if (baseUrl.endsWith("/")) {
            url = url.slice(0, -1);
        }
        return url;
    }
})().catch(async () => {

}).finally(async () => {
    await jd_cookie.set("rabbit_pro_cf_running", false);
});
