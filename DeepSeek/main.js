/**
 * @name DeepSeek
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.1.0
 * @description 一个基于 OpenAI 的对话模块，用于与用户进行对话。\n
 * DeepSeek API地址：https://api.deepseek.com；模型：deepseek-chat, deepseek-reasoner \n
 * 硅基流动 API地址：https://api.siliconflow.cn/v1；模型：Pro/deepseek-ai/DeepSeek-R1, Pro/deepseek-ai/DeepSeek-V3, deepseek-ai/DeepSeek-R1, deepseek-ai/DeepSeek-V3 \n
 * 注册硅基流动，请用我的邀请连接，谢谢🙏 https://cloud.siliconflow.cn/i/kVpa2S6c
 * v1.1.0 增加连续对话模式
 * @rule ai [text]
 * @rule /aitalk
 * @form {key: "deepseek.baseURL", title: "deepseek服务地址" , tooltip: "deepseek模型支持的服务地址，比如官网、硅基流动等", required: true}
 * @form {key: "deepseek.apiKey", title: "API Key" , tooltip: "API Key", required: true}
 * @form {key: "deepseek.model", title: "模型名称" , tooltip: "模型名称，比如 Pro/deepseek-ai/DeepSeek-R1, deepseek-chat", required: true}
 * @public true
 * @admin false
 * @disable false
 * @encrypt false
 * @class AI
 * @create_at 2099-01-01 10:10:00
 * @icon https://img.icons8.com/?size=100&id=XBzV4XQFhfnk&format=png&color=000000
 */
const {OpenAI} = require('openai');  // 这个是官方 SDK
const {console, sender, Bucket} = require('sillygirl');

// 初始化对话历史
let s = sender, openai, model, conversationHistory = [
    {role: 'system', content: '你是一个优秀的日常生活助理，请不要使用markdown语法。'},  // 系统消息
];

const wait4Input = async (tipMsg = '', reg = /.+/, errMsg = null, tryNum = 3) => {
    tipMsg && await s.reply(tipMsg)
    let input
    try {
        input = await s.listen({
            timeout: 3 * 60 * 1000
        })
        s = input // 保持对话
    } catch (e) {
        console.error(e)
        await s.reply("超时，已退出")
        process.exit()
    }
    let content = await input.getContent()
    if (content === "q" || content === "Q") {
        if (!reg) {
            return content
        }
        await s.reply("退出连续对话模式，拜拜～")
        process.exit()
    }

    try {
        let num = 1
        errMsg = !errMsg ? `输入错误，${tipMsg}` : errMsg
        while (!reg.test((content = await input.getContent()))) {

            if (content === "q" || content === "Q") {
                await s.reply("退出连续对话模式，拜拜～")
                process.exit()
            }

            num++
            // await s.reply(`验证失败，请输入正确的6位数验证码：`)
            await s.reply(errMsg)
            input = await s.listen({
                timeout: 60000
            })
            s = input // 保持对话
            if (num > tryNum) {
                await s.reply(`超时已退出`)
                process.exit()
            }
        }
    } catch (e) {
        console.error(e)
        await s.reply(`异常已退出。${e.message}`)
        process.exit()
    }
    return content
}

const init = async () => {
    const deepseekDB = new Bucket('deepseek');
    const baseURL = await deepseekDB.get('baseURL');
    const apiKey = await deepseekDB.get('apiKey');
    model = await deepseekDB.get('model');
    if (!baseURL || !apiKey || !model) {
        await s.reply('请先配置 DeepSeek 服务地址、 API Key和模型。');
        return;
    }

    // 配置 OpenAI API 密钥
    openai = new OpenAI({
        baseURL, apiKey
    });
}

const main = async (userInput) => {

    // 处理用户输入并与 OpenAI 进行对话
    try {
        const start = (new Date()).getTime();
        conversationHistory.push({role: 'user', content: userInput});
        const response = await openai.chat.completions.create({
            model,  // 你可以选择不同的模型，比如 gpt-3.5 或 gpt-4, Pro/deepseek-ai/DeepSeek-R1
            messages: conversationHistory
        });
        const end = (new Date()).getTime();

        // 获取 OpenAI 的回复
        const role = response.choices[0].message.role;
        const content = response.choices[0].message.content;
        const reasoning_content = response.choices[0].message?.reasoning_content;

        // 输出 OpenAI 的回复
        if (reasoning_content) {
            console.log('AI Thinking:', reasoning_content);
            // await s.reply(`AI Thinking: ${reasoning_content}`);
        }
        console.log('AI:', content);
        await s.reply(`AI: ${content} \n\n-- 本次对话耗时：${(end - start) / 1000} 秒`);

        // 将 OpenAI 的回复添加到对话历史
        conversationHistory.push({role, content});
    } catch (error) {
        console.error('对话出错:', error);
    }
}

const talk = async () => {
    let input = await wait4Input('我是你的日常生活助理，请问有什么可以帮您？\n\n-- 输入q退出连续对话模式');
    do {
        await main(input)
        input = await wait4Input();
    } while (input)
}


(async () => {
    await init();

    const s1 = await s.getContent();
    if (s1 === "/aitalk") {
        return await talk();
    }

    const text = await s.param('text');
    await main(text)
})().catch(console.error).finally(() => {
});