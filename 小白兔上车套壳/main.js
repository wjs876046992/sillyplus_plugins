/**
 * @name 小白兔上车套壳
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description 配合pro-rabbit使用，仅仅是命令套壳
 * @rule ^(上车)$
 * @public true
 * @disable false
 * @encrypt false
 * @class Rabbit
 * @create_at 2099-01-01 19:19:30
 * @icon https://img.icons8.com/?size=100&id=XaiON9SINqn0&format=png&color=000000
 */

const {sender: s} = require('sillygirl');

(async () => {
    await s.reply(`请选择一个渠道（输入序号：）
    1、短信✉️登录
    2、京东扫🐎登录
    3、账密登录（推荐💯）
    4、口令登录`);

    const input = await s.listen({
        timeout: 3 * 60 * 1000
    })
    const index = await input.getContent();
    if (index === '1') {
        await (await s.getAdapter()).receive({
            content: '登录',
            user_id: await s.getUserId(),
            user_name: await s.getUserName()
        })
    } else if (index === '2') {
        await (await s.getAdapter()).receive({
            content: '扫码登录',
            user_id: await s.getUserId(),
            user_name: await s.getUserName()
        })
    } else if (index === '3') {
        await (await s.getAdapter()).receive({
            content: '账号密码登录',
            user_id: await s.getUserId(),
            user_name: await s.getUserName()
        })
    } else if (index === '4') {
        await (await s.getAdapter()).receive({
            content: '口令登录',
            user_id: await s.getUserId(),
            user_name: await s.getUserName()
        })
    } else {
        await s.reply(`输入错误，请重新发起“上车”`)
    }
})();