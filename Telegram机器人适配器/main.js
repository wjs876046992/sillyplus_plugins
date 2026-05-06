/**
 * @name Telegram机器人适配器
 * @version 1.0.5
 * @description Telegraf Node版本实现Telegram Bot。
 * v1.0.5 修复了消息回复问题
 * @form {key: "tg.token", title: "机器人Token"}
 * @form {key: "tg.url", title: "反向代理地址"}
 * @form {key: "tg.proxy", title: "代理地址", tooltip: "http代理地址"}
 * @disable false
 * @public true
 * @on_start true
 * @class 机器人 Telegram
 * @create_at 2099-01-01 20:18:45
 * @icon https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg
 */

const {
    Bucket,
    Adapter,
    sleep,
    utils: {parseCQText, buildCQTag},
    console
} = require("sillygirl");

const {Telegraf} = require("telegraf");
const db = new Bucket("tg");

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");
let botUsername;

/** 下载文件到临时目录 */
async function downloadToTemp(url) {
    const tempDir = path.join(os.tmpdir(), "tg_bot_downloads");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, {recursive: true});
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const filePath = path.join(tempDir, fileName);

    const response = await axios({
        url,
        method: "GET",
        responseType: "arraybuffer",
        timeout: 60 * 1000, // 设置超时时间为60秒
    });

    fs.writeFileSync(filePath, response.data);
    return filePath;
}

// 工具：将数组分组
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

/** ==================== 工具函数 ==================== */

/** 延迟重试初始化机器人 */
async function initBotWithRetry() {
    const maxRetry = parseInt((await db.get("retry.max")) || "20", 10);
    const baseDelay = parseInt((await db.get("retry.base_delay")) || "1000", 10);

    let attempt = 0;
    let bot;

    while (!bot && attempt < maxRetry) {
        try {
            const token = await db.get("token");
            if (!token) {
                console.error("Telegram token 未配置，等待中...");
            } else {
                // 配置反向代理 API（如果设置了 url）
                const baseApiUrl = (await db.get("url")) || "https://api.telegram.org";

                // 从 db 中读取代理配置
                const proxy = await db.get("proxy"); // 例如：socks5://192.168.1.11:7891 或 http://192.168.1.11:1080
                let agent = null;

                if (proxy) {
                    if (proxy.startsWith("socks")) {
                        const {SocksProxyAgent} = require("socks-proxy-agent");
                        agent = new SocksProxyAgent(proxy);
                    } else if (proxy.startsWith("http")) {
                        const {HttpsProxyAgent} = require("https-proxy-agent");
                        agent = new HttpsProxyAgent(proxy);
                    }
                }

                // 创建 Telegraf Bot 实例
                bot = new Telegraf(token, {
                    telegram: {
                        apiRoot: baseApiUrl,
                        agent, // 代理可能为 null
                    },
                });

                return bot;
            }
        } catch (e) {
            console.error(`Telegram Bot 连接失败（第${attempt + 1}次）：`, e.message || e);
        }

        attempt++;
        const delay = baseDelay * (attempt + 1);
        console.log(`等待 ${delay / 1000}s 后重试...`);
        await sleep(delay);
    }

    throw new Error(`${maxRetry}次重试后仍无法连接 Telegram Bot，请检查配置。`);
}

/** 解析并发送回复（多文件支持） */
async function handleReply(bot, message) {
    const items = parseCQText(message.content);
    const contents = [];
    const images = [];
    const videos = [];

    const [c, message_id] = message.message_id.split(".");
    const chat_id = message.chat_id || message.user_id || null;
    if (!chat_id) {
        console.error("handleReply: 无效的 chat_id 或 user_id，无法发送消息");
        return;
    }

    for (const item of items) {
        if (typeof item === "string") {
            contents.push(item);
        } else if (item.type === "image") {
            images.push(item.params?.file || item.params?.url);
        } else if (item.type === "video") {
            videos.push(item.params?.file || item.params?.url);
        } else {
            // 其他类型的 CQ 标签. 例如 reply、at、face 等, 直接转换为 CQ 标签字符串
            contents.push(buildCQTag(item.type, item.params));
        }
    }

    const textContent = contents.join("\n") || undefined;
    let result;
    const tempFiles = []; // 记录临时文件路径，发送后清理

    try {
        // 单张图片
        if (images.length === 1 && videos.length === 0) {
            const filePath = await downloadToTemp(images[0]);
            tempFiles.push(filePath);
            result = await bot.telegram.sendPhoto(chat_id, {source: filePath}, {
                caption: textContent,
                reply_to_message_id: message_id ? Number(message_id) : undefined,
            });
        }
        // 单个视频
        else if (videos.length === 1 && images.length === 0) {
            const filePath = await downloadToTemp(videos[0]);
            tempFiles.push(filePath);
            result = await bot.telegram.sendVideo(chat_id, {source: filePath}, {
                caption: textContent,
                reply_to_message_id: message_id ? Number(message_id) : undefined,
            });
        }
        // 多个图片或视频 -> sendMediaGroup
        else if (images.length > 1 || videos.length > 1) {
            const media = [];

            // 下载所有图片
            for (let i = 0; i < images.length; i++) {
                const filePath = await downloadToTemp(images[i]);
                tempFiles.push(filePath);
                media.push({
                    type: "photo",
                    media: {source: filePath},
                    ...(i === 0 && textContent ? {caption: textContent} : {})
                });
            }

            // 下载所有视频
            for (let i = 0; i < videos.length; i++) {
                const filePath = await downloadToTemp(videos[i]);
                tempFiles.push(filePath);
                media.push({
                    type: "video",
                    media: {source: filePath},
                    ...(i === 0 && textContent ? {caption: textContent} : {})
                });
            }
            if (media.length === 0) return;

            // 拆分为每组最多10个的子数组
            const mediaChunks = chunkArray(media, 10);
            result = [];

            for (let i = 0; i < mediaChunks.length; i++) {
                const chunk = mediaChunks[i];

                // 只允许第一组的第一个 item 加 caption
                if (i > 0) {
                    for (const item of chunk) {
                        delete item.caption;
                    }
                }

                const groupResult = await bot.telegram.sendMediaGroup(chat_id, chunk, {
                    reply_to_message_id: message_id ? Number(message_id) : undefined,
                });

                result.push(...groupResult);
            }
        }
        // 纯文本消息
        else if (textContent) {
            result = await bot.telegram.sendMessage(chat_id, textContent, {
                reply_to_message_id: message_id ? Number(message_id) : undefined,
            });
        }

        // 返回 message_id（sendMediaGroup 返回的是数组，取第一条）
        let reply_message_id = null;
        if (Array.isArray(result)) {
            reply_message_id = `${result[0].chat.id}.${result[0].message_id}`;
        } else if (result) {
            reply_message_id = `${result.chat.id}.${result.message_id}`;
        }
        console.debug(`发送tg消息成功: ${chat_id} - ${message_id}, reply message: ${reply_message_id}`);
        return reply_message_id;
    } catch (e) {
        console.error("发送消息失败:", e.message || e);
    } finally {
        // 清理临时文件
        for (const filePath of tempFiles) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error(`清理临时文件失败: ${filePath}`, err.message);
            }
        }
    }
}

/** 处理动作 */
async function handleAction(bot, action) {
    if (action.type === "delete_message") {
        const {message_id, message_ids = []} = action
        console.debug('tg bot node: ', message_id, message_ids)
        if (message_ids.length === 0 || (message_id && !message_ids.includes(message_id))) {
            message_ids.push(message_id)
        }
        if (message_ids.length === 0) {
            return
        }

        const msg_ids = {
            // chat_id: [msg_id]
        }
        for (const msgId of message_ids) {
            if (msgId?.indexOf('.') === -1) {
                console.error(`msgId error: ${msgId}`)
                continue;
            }

            const [chatId, messageId] = msgId.split('.')
            if (!msg_ids[chatId]) {
                msg_ids[chatId] = []
            }
            msg_ids[chatId].push(+messageId)
        }
        for (const chat_id in msg_ids) {
            await bot.telegram.deleteMessages(chat_id, msg_ids[chat_id]);
        }
    }
}

/** 处理接收消息 */
function setupMessageListener(bot, adapter) {
    bot.on("text", async (ctx) => {
        try {
            const req = ctx.message;
            const user = req.from || {};
            const chat = req.chat || {};
            let content = req.text || "";
            let isChatGroup = chat?.type !== "private", title = chat.title
            const reply_to_message = req.reply_to_message || null;

            // 检查是否 @ 了机器人
            const entities = req.entities || [];
            const isMentioned = entities.some(ent => {
                if (ent.type === "mention") {
                    // 普通 @ 形式，例如 "@MyBot"
                    const mentionText = content.substring(ent.offset, ent.offset + ent.length);
                    return mentionText === `@${botUsername}`;
                }
                if (ent.type === "text_mention") {
                    // 特殊 mention 类型（直接提及用户 ID）
                    return ent.user && ent.user.username === botUsername;
                }
                return false;
            });

            // 如果 @ 了机器人，可以去掉 @xxx 只保留后面文本
            if (isChatGroup && isMentioned) {
                content = content.replace(new RegExp(`@${botUsername}`, "g"), "").trim();
            } else if (isChatGroup) {
                // 如果是群聊没有 @ 机器人，直接忽略这条消息
                return;
            }

            if (reply_to_message) {
                content = buildCQTag('reply', {
                    content,
                    reply_text: reply_to_message?.text,
                    reply_id: isChatGroup ? `${chat.id}.${reply_to_message?.message_id}` : reply_to_message?.message_id
                })
                console.debug(`tg reply: ${content}`)
            }

            const message = {
                user_id: user.id ? user.id.toString() : "",
                user_name: user.username || "",
                chat_id: isChatGroup ? (chat.id ? chat.id.toString() : "") : "",
                chat_name: title || "",
                content,
                message_id: chat.id && req.message_id ? `${chat.id}.${req.message_id}` : "",
            };

            if (message.message_id) {
                await adapter.receive(message);
            } else {
                console.error("收到消息但 message_id 无效，忽略");
            }
        } catch (e) {
            console.error("处理消息事件出错:", e.message || e);
        }
    });
}

/** ==================== 主流程 ==================== */

(async () => {
    try {
        const bot = await initBotWithRetry();

        // 检查能否获取 bot 信息
        const me = await bot.telegram.getMe();
        const bot_id = me.id.toString();
        botUsername = me.username || "";
        // console.log(`Telegram Bot 已连接，Bot ID: ${bot_id}`);

        const adapter = new Adapter({
            platform: "tg",
            bot_id,
            replyHandler: async (msg) => await handleReply(bot, msg),
            actionHandler: (action) => handleAction(bot, action),
        });

        setupMessageListener(bot, adapter);

        // 开始轮询
        await bot.launch();
    } catch (e) {
        console.error("Telegram Bot 初始化失败：", e.message || e);
    }
})();