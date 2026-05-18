/**
 * @name Pro登录服务
 * @author Elena
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description dotnet9 Pro服务 - 账密登录、短信登录、扫码登录、wskey转换，交互式逐步引导
 * @rule ^ws(\s+\S+)?$
 * @rule ^pro\s+login$
 * @rule ^pro\s+sms$
 * @rule ^pro\s+qr$
 * @rule ^pro\s+renewal$
 * @rule ^pro\s+help$
 * @rule ^pro$
 * @public true
 * @disable false
 * @encrypt false
 * @class 京东
 * @icon https://img.icons8.com/?size=100&id=H6ME16kRCdsn&format=png&color=000000
 * @create_at 2099-01-01 00:00:00
 * @form {key: "pro_service.base_url", title: "服务地址", tooltip: "Pro服务的基础URL，如 https://pro.example.com", required: true}
 * @form {key: "pro_service.bot_api_token", title: "BotApiToken", tooltip: "Bot调用必须传递的Token", required: true}
 */

const { Bucket, console, sender: s } = require("sillygirl");
const axios = require("axios");

const bucket = new Bucket("pro_service");

// ==================== 工具函数 ====================

function buildUrl(base, path) {
    return base.replace(/\/+$/, "") + path;
}

async function apiPost(url, data) {
    const { data: result } = await axios.post(url, data, {
        responseType: "json",
        timeout: 30000,
    });
    console.debug(`[Pro服务] POST ${url} → ${JSON.stringify(result)}`);
    return result;
}

function isSuccess(res) { return res?.success === true; }

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ==================== 交互式流程 ====================

/**
 * 通用：等待用户输入，返回内容
 */
async function waitInput(prompt, timeoutMs = 120000) {
    await s.reply(prompt);
    const input = await s.listen({ timeout: timeoutMs });
    return await input.getContent();
}

// ---------- 1. wskey 转换 ----------

async function flowWs(wskey) {
    // 如果命令自带 wskey 就直接用，否则交互输入
    if (!wskey) {
        wskey = await waitInput("📝 请输入 wskey：");
    }
    if (!wskey || wskey.trim() === "") {
        await s.reply("❌ wskey 不能为空");
        return;
    }
    wskey = wskey.trim();

    const url = buildUrl(await bucket.get("base_url"), "/env/wskey");
    const result = await apiPost(url, {
        BotApiToken: await bucket.get("bot_api_token"),
        Wskey: wskey,
    });
    if (!isSuccess(result)) {
        await s.reply(`❌ wskey 转换失败：${result?.message || "未知错误"}`);
        return;
    }
    const appck = result?.data?.appck;
    if (appck) {
        await s.reply(`✅ wskey 转换成功\n\nappck：${appck}`);
    } else {
        await s.reply(`✅ wskey 转换完成\n返回数据：${JSON.stringify(result.data)}`);
    }
}

// ---------- 2. 账号密码登录 ----------

async function flowLogin() {
    // 第一步：输入手机号
    let phone = await waitInput("📞 请输入手机号：");
    if (!phone || phone.trim() === "") {
        await s.reply("❌ 手机号不能为空");
        return;
    }
    phone = phone.trim();
    if (!/^\d{11}$/.test(phone)) {
        await s.reply("❌ 手机号格式不正确，请输入 11 位手机号");
        return;
    }

    // 第二步：输入密码
    let password = await waitInput("🔑 请输入密码：");
    if (!password || password.trim() === "") {
        await s.reply("❌ 密码不能为空");
        return;
    }
    password = password.trim();

    // 调用登录接口
    await s.reply("⏳ 正在登录，请稍候...");
    const url = buildUrl(await bucket.get("base_url"), "/Pwd/Login");
    const result = await apiPost(url, {
        username: phone,
        password,
        BotApitoken: await bucket.get("bot_api_token"),
    });
    if (!isSuccess(result)) {
        await s.reply(`❌ 登录失败：${result?.message || "未知错误"}`);
        return;
    }

    const d = result.data;
    const step2 = await handleLoginResult(d, "登录", phone);
    if (step2 === false) return;          // 已完成（成功或放弃）
    // step2 = "sms" 或 "card"
    await doLoginVerify(phone, step2, "登录");
}

/**
 * 处理登录结果 d，返回下一步需要的验证方式：
 *   "sms"  → 需要短信验证
 *   "card" → 需要身份证验证
 *   false  → 流程结束（成功或出错）
 */
async function handleLoginResult(d, actionName, phone) {
    // 成功
    if (d?.ck) {
        let msg = `✅ ${actionName}成功\nCK：${d.ck}`;
        if (d.rwskey) msg += `\n\nrwskey：${d.rwskey}`;
        await s.reply(msg);
        return false;
    }

    // 需要验证 (status = 555)
    if (d?.status === 555) {
        // 如果有 jmp_url，先提示用户处理
        if (d.jmp_url) {
            await s.reply(`⚠️ 需要进一步验证，请打开以下链接完成验证：\n${d.jmp_url}\n\n完成后重新发送 pro login`);
            return false;
        }

        // 根据 mode 确定验证方式
        if (d.mode === "USER_ID") {
            // 需要身份证验证 → smsVerifyCard
            return "card";
        }
        // 其他情况（HISTORY_DEVICE 等）→ 先尝试短信验证码
        return "sms";
    }

    // 未知状态
    await s.reply(`⚠️ ${actionName}返回未知状态：\n${JSON.stringify(d)}`);
    return false;
}

/**
 * 二级验证：短信验证码 → 可能再需要身份证验证
 */
async function doLoginVerify(phone, verifyType, actionName) {
    // 先发短信
    const sendUrl = buildUrl(await bucket.get("base_url"), "/sms/SendSMS");
    await s.reply("📨 正在发送短信验证码...");
    const sendRes = await apiPost(sendUrl, {
        Phone: phone,
        BotApitoken: await bucket.get("bot_api_token"),
    });
    if (!isSuccess(sendRes)) {
        await s.reply(`❌ 发送短信验证码失败：${sendRes?.message || "未知错误"}`);
        return;
    }
    await s.reply("✅ 短信验证码已发送");

    // 等用户输入验证码
    let code = await waitInput("📨 请输入短信验证码：");
    if (!code || code.trim() === "") {
        await s.reply("❌ 验证码不能为空，" + actionName + "已取消");
        return;
    }
    code = code.trim();

    if (verifyType === "card") {
        // 验证码 + 身份证验证
        const cardUrl = buildUrl(await bucket.get("base_url"), "/sms/VerifyCard");
        await s.reply("⏳ 正在验证身份信息...");
        const cardRes = await apiPost(cardUrl, {
            Phone: phone,
            Code: code,
            BotApitoken: await bucket.get("bot_api_token"),
        });
        if (!isSuccess(cardRes)) {
            await s.reply(`❌ 身份验证失败：${cardRes?.message || "未知错误"}`);
            return;
        }
        const cd = cardRes.data;
        if (cd?.ck) {
            let msg = `✅ ${actionName}成功（身份验证通过）\nCK：${cd.ck}`;
            if (cd.rwskey) msg += `\n\nrwskey：${cd.rwskey}`;
            await s.reply(msg);
        } else {
            await s.reply(`✅ 身份验证通过\n${JSON.stringify(cd)}`);
        }
        return;
    }

    // 短信验证码验证
    const verifyUrl = buildUrl(await bucket.get("base_url"), "/sms/VerifyCode");
    await s.reply("⏳ 正在验证短信验证码...");
    const verifyRes = await apiPost(verifyUrl, {
        Phone: phone,
        Code: code,
        BotApitoken: await bucket.get("bot_api_token"),
    });
    if (!isSuccess(verifyRes)) {
        await s.reply(`❌ 短信验证码验证失败：${verifyRes?.message || "未知错误"}`);
        return;
    }

    const vd = verifyRes.data;
    // 验证成功且有 ck → 直接完成
    if (vd?.ck) {
        let msg = `✅ ${actionName}成功（短信验证通过）\nCK：${vd.ck}`;
        if (vd.rwskey) msg += `\n\nrwskey：${vd.rwskey}`;
        await s.reply(msg);
        return;
    }

    // 还需要进一步验证
    if (vd?.status === 555) {
        if (vd.mode === "USER_ID") {
            // 需要身份证验证
            let idCard = await waitInput("🆔 请输入身份证号：");
            if (!idCard || idCard.trim() === "") {
                await s.reply("❌ 身份证号不能为空，" + actionName + "已取消");
                return;
            }
            idCard = idCard.trim();

            const cardUrl = buildUrl(await bucket.get("base_url"), "/sms/VerifyCard");
            await s.reply("⏳ 正在验证身份信息...");
            const cardRes = await apiPost(cardUrl, {
                Phone: phone,
                Code: code,     // 还是用之前的验证码
                BotApitoken: await bucket.get("bot_api_token"),
            });
            if (!isSuccess(cardRes)) {
                await s.reply(`❌ 身份验证失败：${cardRes?.message || "未知错误"}`);
                return;
            }
            const cd = cardRes.data;
            if (cd?.ck) {
                let msg = `✅ ${actionName}成功（身份证验证通过）\nCK：${cd.ck}`;
                if (cd.rwskey) msg += `\n\nrwskey：${cd.rwskey}`;
                await s.reply(msg);
            } else {
                await s.reply(`✅ 身份证验证通过\n${JSON.stringify(cd)}`);
            }
        } else {
            await s.reply(`⚠️ 需要设备验证，详情：${JSON.stringify(vd)}`);
        }
        return;
    }

    // 其他情况
    await s.reply(`✅ 验证码验证通过\n${JSON.stringify(vd)}`);
}

// ---------- 3. 短信登录 ----------

async function flowSms() {
    // 第一步：输入手机号
    let phone = await waitInput("📞 请输入手机号：");
    if (!phone || phone.trim() === "") {
        await s.reply("❌ 手机号不能为空");
        return;
    }
    phone = phone.trim();
    if (!/^\d{11}$/.test(phone)) {
        await s.reply("❌ 手机号格式不正确，请输入 11 位手机号");
        return;
    }

    // 发短信
    const sendUrl = buildUrl(await bucket.get("base_url"), "/sms/SendSMS");
    await s.reply("📨 正在发送短信验证码...");
    const sendRes = await apiPost(sendUrl, {
        Phone: phone,
        BotApitoken: await bucket.get("bot_api_token"),
    });
    if (!isSuccess(sendRes)) {
        await s.reply(`❌ 发送短信验证码失败：${sendRes?.message || "未知错误"}`);
        return;
    }
    await s.reply("✅ 短信验证码已发送，请注意查收");

    // 输入验证码
    let code = await waitInput("📨 请输入短信验证码（6位数字）：");
    if (!code || code.trim() === "") {
        await s.reply("❌ 验证码不能为空，短信登录已取消");
        return;
    }
    code = code.trim();

    // 验证
    const verifyUrl = buildUrl(await bucket.get("base_url"), "/sms/VerifyCode");
    await s.reply("⏳ 正在验证短信验证码...");
    const verifyRes = await apiPost(verifyUrl, {
        Phone: phone,
        Code: code,
        BotApitoken: await bucket.get("bot_api_token"),
    });
    if (!isSuccess(verifyRes)) {
        await s.reply(`❌ 短信验证失败：${verifyRes?.message || "未知错误"}`);
        return;
    }

    const vd = verifyRes.data;
    if (vd?.ck) {
        let msg = `✅ 短信登录成功\nCK：${vd.ck}`;
        if (vd.rwskey) msg += `\n\nrwskey：${vd.rwskey}`;
        await s.reply(msg);
        return;
    }

    // 需要进一步验证
    if (vd?.status === 555) {
        if (vd.mode === "USER_ID") {
            let idCard = await waitInput("🆔 请输入身份证号进行身份验证：");
            if (!idCard || idCard.trim() === "") {
                await s.reply("❌ 身份证号不能为空，登录已取消");
                return;
            }
            idCard = idCard.trim();

            const cardUrl = buildUrl(await bucket.get("base_url"), "/sms/VerifyCard");
            await s.reply("⏳ 正在验证身份信息...");
            const cardRes = await apiPost(cardUrl, {
                Phone: phone,
                Code: code,
                BotApitoken: await bucket.get("bot_api_token"),
            });
            if (!isSuccess(cardRes)) {
                await s.reply(`❌ 身份验证失败：${cardRes?.message || "未知错误"}`);
                return;
            }
            const cd = cardRes.data;
            if (cd?.ck) {
                let msg = `✅ 短信登录成功（身份证验证通过）\nCK：${cd.ck}`;
                if (cd.rwskey) msg += `\n\nrwskey：${cd.rwskey}`;
                await s.reply(msg);
            } else {
                await s.reply(`✅ 身份证验证通过\n${JSON.stringify(cd)}`);
            }
        } else {
            await s.reply(`⚠️ 需要设备验证\n详情：${JSON.stringify(vd)}`);
        }
        return;
    }

    await s.reply(`✅ 短信验证完成\n${JSON.stringify(vd)}`);
}

// ---------- 4. 扫码登录 ----------

async function flowQr() {
    const baseUrl = await bucket.get("base_url");

    // 获取二维码 KEY
    const keyUrl = buildUrl(baseUrl, "/qr/GetQRKey");
    const result = await apiPost(keyUrl, {
        BotApitoken: await bucket.get("bot_api_token"),
    });
    if (!isSuccess(result)) {
        await s.reply(`❌ 获取二维码失败：${result?.message || "未知错误"}`);
        return;
    }
    const key = result?.data?.key;
    if (!key) {
        await s.reply("❌ 未返回二维码 KEY");
        return;
    }

    const qrLink = `${baseUrl}/qr/scan?key=${key}`;
    await s.reply(`📱 请使用京东 App 扫描以下二维码登录\n\n二维码链接：${qrLink}\nKEY：${key}`);

    // 轮询检查扫码状态（最长等 90 秒）
    await s.reply("⏳ 正在等待扫码（90 秒超时）...");
    const checkUrl = buildUrl(baseUrl, "/qr/CheckQRKey");

    for (let i = 0; i < 30; i++) {
        await sleep(3000);
        const checkRes = await apiPost(checkUrl, {
            qrkey: key,
            BotApitoken: await bucket.get("bot_api_token"),
        });

        if (!isSuccess(checkRes)) continue;

        const d = checkRes.data;
        if (d?.status === -1) {
            await s.reply("❌ 二维码已过期，请重新发送 pro qr");
            return;
        }
        if (d?.status === -2) {
            await s.reply("❌ BotApiToken 错误或二维码 KEY 无效，请检查配置");
            return;
        }
        if (d?.ck) {
            let msg = `✅ 扫码登录成功\nCK：${d.ck}`;
            if (d.rwskey) msg += `\n\nrwskey：${d.rwskey}`;
            await s.reply(msg);
            return;
        }
        // 还未扫码，继续等
    }

    await s.reply("⏰ 扫码超时，请重新发送 pro qr");
}

// ---------- 5. 续期登录 ----------

async function flowRenewal() {
    let phone = await waitInput("📞 请输入需要续期的手机号：");
    if (!phone || phone.trim() === "") {
        await s.reply("❌ 手机号不能为空");
        return;
    }
    phone = phone.trim();

    let password = await waitInput("🔑 请输入密码：");
    if (!password || password.trim() === "") {
        await s.reply("❌ 密码不能为空");
        return;
    }
    password = password.trim();

    await s.reply("⏳ 正在续期，请稍候...");
    const url = buildUrl(await bucket.get("base_url"), "/Pwd/RenewalLogin");
    const result = await apiPost(url, {
        username: phone,
        password,
        BotApitoken: await bucket.get("bot_api_token"),
    });
    if (!isSuccess(result)) {
        await s.reply(`❌ 续期失败：${result?.message || "未知错误"}`);
        return;
    }

    const d = result.data;
    const step2 = await handleLoginResult(d, "续期", phone);
    if (step2 === false) return;
    await doLoginVerify(phone, step2, "续期");
}

// ==================== 主入口 ====================

(async () => {
    const content = await s.getContent();

    // 基础配置检查
    const baseUrl = await bucket.get("base_url");
    const botApiToken = await bucket.get("bot_api_token");
    if (!baseUrl) {
        await s.reply("❌ 请先配置服务地址\n设置 pro_service.base_url = 你的服务地址");
        return;
    }
    if (!botApiToken) {
        await s.reply("❌ 请先配置 BotApiToken\n设置 pro_service.bot_api_token = 你的Token");
        return;
    }

    // --- ws ---
    const wsMatch = content.match(/^ws(?:\s+(\S+))?$/);
    if (wsMatch) {
        await flowWs(wsMatch[1]);
        return;
    }

    // --- pro ---
    const proMatch = content.match(/^pro(?:\s+(.+))?$/);
    if (!proMatch) return;

    const sub = proMatch[1] || "help";

    switch (sub) {
        case "help":
        case "":
            await s.reply(
                "📋 Pro登录服务 可用命令：\n\n" +
                "  ws [wskey]          - wskey 转换 appck\n" +
                "  pro login           - 账号密码登录（交互式）\n" +
                "  pro sms             - 短信验证码登录（交互式）\n" +
                "  pro qr              - 扫码登录\n" +
                "  pro renewal          - 续期登录（交互式）\n" +
                "  pro help            - 显示此帮助\n\n" +
                "配置项：pro_service.base_url / pro_service.bot_api_token"
            );
            break;

        case "login":
            await flowLogin();
            break;

        case "sms":
            await flowSms();
            break;

        case "qr":
            await flowQr();
            break;

        case "renewal":
            await flowRenewal();
            break;

        default:
            await s.reply(
                `❌ 未知子命令：${sub}\n` +
                "发送 pro help 查看可用命令"
            );
    }
})().catch(async (e) => {
    console.log(`[Pro服务] 异常：${e.message}\n${e.stack}`);
    await s.reply(`❌ 执行出错：${e.message}`);
});
