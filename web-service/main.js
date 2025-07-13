/**
 * @name 小白兔🐰通用模块(必须安装)
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 2.0.2
 * @description 该插件会自动安装小白兔插件所须依赖，所以需要时间比较长，安装时请耐心等待。
 * 问题：傻妞不能在node版中注册RESTful API，所以用express搭建一个web服务，用于注册扩展API。可自定义端口（默认30000），然后通过反代暴露接口到公网。
 * 请求：http://ip:30000/ping，返回已支持的适配器。
 * v1.0.0 增加企业微信客服回调，地址为 post http://ip:30000/api/bot/qywxkf，默认需手动开启
 * v1.1.0 增加WeChat Ferry适配器，地址为 post http://ip:30000/api/bot/wcf，默认需手动开启
 * v1.2.0 增加返利淘宝渠道授权回调，地址为 post http://ip:30000/api/tb-relation-auth/callback，默认需手动开启
 * v1.2.1 为统一平台，将wcf的platform改为wx
 * v1.2.2 支持将带图的qq消息转发到微信
 * v1.3.0 增加wxpusher返利注册回调，地址为 post http://ip:30000/api/wxpusher/fanli-register，默认需手动开启
 * v1.3.1 当端口被占用时，尝试终止占用端口的进程
 * v2.0.1 合并原基础模块，支持注册插件
 * v2.0.2 修复依赖安装问题，增加插件注册和注销接口
 * @rule 修复依赖
 * @form {key: "jd_sign.sign_host", title: "JD签名地址" , tooltip: "包含h5st和sign，没有则使用内置", required: false}
 * @form {key: "jd_sign.proxy_url", title: "获取代理的地址" , tooltip: "星空、携趣等", required: false}
 * @form {key: "jd_sign.redis_config", title: "redis 配置" , tooltip: "{\"host\":\"10.241.1.12\",\"port\":6379,\"password\":null,\"db\":2,\"sentinels\":[{\"host\":\"10.241.1.8\",\"port\":26379},{\"host\":\"10.241.1.8\",\"port\":26380},{\"host\":\"10.241.1.8\",\"port\":26381}],\"name\":\"redis-master\"}", required: false, default: '{}'}
 * @form {key: "notice.wx", title: "全局wx通知开关", tooltip: "比如每天资产通知时会推送农场成熟", valueType: 'switch'}
 * @form {key: "notice.qq", title: "全局qq通知开关", tooltip: "比如每天资产通知时会推送农场成熟", valueType: 'switch'}
 * @form {key: "notice.wxpusher", title: "全局WxPusher开关", tooltip: "比如每天资产通知时会推送农场成熟", valueType: 'switch'}
 * @form {key: "notice.wxpusher_token", title: "全局WxPusher Token", tooltip: "关注WxPusher消息推送平台获取"}
 * @form {key: "web_service.proxy_url", title: "当前服务的反代地址", tooltip: "用于生成回调URL", required: false}
 * @form {key: "web_service.PORT", title: "监听端口", tooltip: "监听端口，建议通过反向代理暴露，默认30000", required: false, type: "digit"}
 * @form {key: "web_service.qywxkf_enabled", title: "启用qywxkf适配器", tooltip: "默认不启用", required: false, valueType: 'switch'}
 * @form {key: "qywxkf.token", title: "Token", tooltip: "回调配置-Token", required: true}
 * @form {key: "qywxkf.aesKeyEncoding", title: "EncodingAESKey", tooltip: "回调配置-EncodingAESKey", required: true}
 * @form {key: "qywxkf.corpid", title: "企业ID" , tooltip: "开发者信息-企业ID", required: true}
 * @form {key: "qywxkf.corpsecret", title: "Secret", tooltip: "开发者信息-Secret", required: true}
 * @form {key: "web_service.wcf_enabled", title: "启用wcf适配器", tooltip: "wcf微信机器人", required: false, valueType: 'switch'}
 * @form {key: "wx.wcf_host", title: "WeChat Ferry机器人HTTP地址", required: true}
 * @form {key: "web_service.tb_relation_auth_enabled", title: "启用淘宝渠道备案回调", tooltip: "暴露一个回调地址，搭配“淘宝渠道备案”插件使用", required: false, valueType: 'switch'}
 * @form {key: "web_service.wxpusher_enabled", title: "启用wxpusher返利注册回调", tooltip: "暴露一个回调地址，搭配“返利注册”插件使用", required: false, valueType: 'switch'}
 * @public true
 * @admin true
 * @disable false
 * @encrypt false
 * @service true
 * @class 机器人
 * @create_at 2099-01-01 20:20:00
 * @icon https://img.icons8.com/?size=100&id=DJWlbd0VP2As&format=png&color=000000
 */
const {Bucket, console, sender: s} = require('sillygirl');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


// 启动 HTTP 和 WebSocket 服务器
const register = async () => {
    const http = require('http'), net = require('net'), Express = require('express'), WebSocket = require('ws');
    const modules = require('./modules');

    // 检查端口是否被占用
    const checkPort = (port) => {
        return new Promise((resolve, reject) => {
            const tester = net.createServer()
                .once('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        reject(`端口 ${port} 已被占用`);
                    } else {
                        reject(err);
                    }
                })
                .once('listening', () => {
                    tester.once('close', () => resolve())
                        .close();
                })
                .listen(port);
        });
    };

    // 获取占用端口的进程ID并终止
    const killProcessUsingPort = async (port) => {
        try {
            // 查找占用端口的进程PID
            const { stdout } = await exec(`lsof -t -i:${port}`);
            const pid = stdout.trim();
            if (!pid) {
                throw new Error('无法找到占用端口的进程');
            }
            // 杀掉进程
            await exec(`kill -9 ${pid}`);
            return `进程 ${pid} 已被终止`;
        } catch (err) {
            throw new Error('终止进程失败: ' + (err.message || err));
        }
    };

    const webServiceDB = new Bucket('web_service');
    let PORT = await webServiceDB.get('PORT');
    if (!PORT) { // 初始化端口，并保存到数据库
        PORT = 30000;
        await webServiceDB.set('PORT', PORT);
    }

    const app = new Express();
    app.use('/api/wxpusher/fanli-register', Express.json()); // 解析JSON请求体
    app.get('/health', (req, res) => {
        res.status(200).send('Web service is running');
    });

    // add your routes here
    for (const [name, module] of Object.entries(modules)) {
        const enabled = await webServiceDB.get(`${name}_enabled`, false);  // 根据模块名获取启用状态
        console.log(`模块 ${name} 启用状态：${enabled}`);
        if (enabled && typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module(app);  // 执行模块并传入 app
        }
    }

    // 允许注册插件
    app.use('/api/plugins/:oper', Express.json()); // 解析JSON请求体
    app.post('/api/plugins/register', async (req, res) => {
        const {names, file} = req.body;
        if (!names || names.length === 0 || !file) {
            return res.status(400).send('Invalid request');
        }

        try {
            const registeredPlugins = await webServiceDB.get('registered_plugins', {});
            for (const [name, module] of Object.entries(require(file))) {
                const enabled = await webServiceDB.get(`${name}_enabled`, false);  // 根据模块名获取启用状态
                if (enabled && names.includes(name) && typeof module === 'function') {  // 如果模块启用且是可调用函数
                    console.log(`Registering plugin: ${name}`);
                    await module(app);  // 执行模块并传入 app
                    registeredPlugins[name] = file;
                }
            }
            await webServiceDB.set('registered_plugins', registeredPlugins);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Error registering plugin');
        }

        return res.status(200).send('Plugin registered');
    });
    app.post('/api/plugins/unregister', async (req, res) => {
        const {names = []} = req.body;
        if (!names || names.length === 0) {
            return res.status(400).send('Invalid request');
        }

        try {
            const registeredPlugins = await webServiceDB.get('registered_plugins', {});
            for (const name of names) {
                if (registeredPlugins[name]) {
                    console.log(`Unregistering plugin: ${name}, file: ${registeredPlugins[name]}`);
                    delete registeredPlugins[name];
                }
            }
            await webServiceDB.set('registered_plugins', registeredPlugins);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Error: unregister plugin');
        }

        return res.status(200).send('Success: Plugin registered');
    });

    let canRun = false;
    try {
        await checkPort(PORT);
        canRun = true;
    } catch (err) {
        console.log(err);
        console.log(`尝试终止占用端口的进程...`);
        try {
            const killMsg = await killProcessUsingPort(PORT);
            console.log(killMsg);
            canRun = true;
        } catch (killErr) {
            console.log(killErr);
        }
    }

    if (!canRun) {
        console.log(`无法启动服务器，端口 ${PORT} 已被占用`);
        return;
    }

    const registeredPlugins = await webServiceDB.get('registered_plugins', {});
    for (const [name, file] of Object.entries(registeredPlugins)) {
        try {
            const module = require(file);
            if (typeof module === 'function') {
                console.log(`Registering plugin: ${name}`);
                await module(app);
            }
        } catch (e) {
            console.error(`Error registering plugin: ${name}, ${e.message}`);
        }
    }

    // 创建 HTTP 服务器
    const server = http.createServer(app);

    // 创建 WebSocket 服务器并附加到 HTTP 服务器
    const wss = new WebSocket.Server({server});

    // 监听 WebSocket 连接
    wss.on('connection', (ws) => {
        console.log('New WebSocket connection');

        // 监听客户端消息
        ws.on('message', (message) => {
            console.log('Received:', message);

            // 向客户端发送响应
            ws.send(`Echo: ${message}`);
        });

        // 监听关闭事件
        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });

    server.listen(PORT, () => {
        console.log(`服务器正在运行，支持 HTTP 和 WebSocket，端口: ${PORT}`);
    });
};

const { spawn } = require('child_process');

const installYarnDeps = (nodeExec, yarnExec, pluginsDir) => {
    return new Promise((resolve, reject) => {
        const child = spawn(nodeExec, [`${yarnExec}.js`, 'install'], { cwd: pluginsDir });

        child.stdout.on('data', (data) => {
            console.log(data.toString()); // 实时输出到控制台
        });

        child.stderr.on('data', (data) => {
            console.log(data.toString()); // 实时输出错误
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`yarn install exited with code ${code}`));
            }
        });
    });
};

const installDeps = async () => {
    const webServiceDB = new Bucket('web_service');
    let install_package = JSON.parse(await webServiceDB.get('install_package', 'true'));
    if (!install_package) {
        console.log('已设置不自动安装包管理, End');
        return;
    }

    const fs = require('fs');
    const path = require('path');
    // 获取父目录路径 => /path/to/plugins
    const pluginsDir = path.resolve(__dirname, '..');
    const homeDir = path.resolve(pluginsDir, '..');
    const nodeDir = path.resolve(homeDir, 'language/node');
    const nodeExec = path.resolve(nodeDir, 'node');
    const yarnExec = path.resolve(nodeDir, 'yarn/bin/yarn');

    // 检查父目录是否存在 package.json
    const packageJsonPath = path.join(pluginsDir, 'package.json');

    // 如果没有 package.json 文件，创建一个
    const packageJsonContent = {
        "name": "sp_plugins",
        "version": "1.0.0",
        "license": "MIT",
        "private": true,
        "workspaces": [
            "*",
            "!node_modules",
            "!encrypted"
        ],
        "dependencies": {
            "axios": "^1.7.9",
            "crypto-js": "^4.1.1",
            "express": "^4.21.2",
            "ioredis": "^5.3.2",
            "moment": "^2.29.4",
            "mongoose": "^5.13.3",
            "qs": "^6.12.1",
            "tunnel": "^0.0.6",
            "uuid": "^9.0.1"
        },
        "devDependencies": {
            "@babel/core": "^7.25.2",
            "@babel/preset-env": "^7.25.4",
            "babel-loader": "^9.2.1",
            "javascript-obfuscator": "^4.1.1",
            "terser-webpack-plugin": "^5.3.10",
            "webpack": "^5.95.0",
            "webpack-bundle-analyzer": "^4.10.2",
            "webpack-cli": "^5.1.4",
            "webpack-merge": "^6.0.1",
            "webpack-node-externals": "^3.0.0"
        }
    };
    // 写入 package.json 文件
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 4), {encoding: 'utf8'});
    await s.reply(`已创建 package.json 文件`)

    // 设置 Yarn registry
    const { stdout, stderr } = await exec(`${nodeExec} ${yarnExec}.js config set registry https://registry.npmmirror.com`, {cwd: pluginsDir});
    if (stderr) {
        console.error(`exec error: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    await s.reply('已设置 Yarn registry 为 https://registry.npmmirror.com');

    // 执行 yarn install
    await s.reply('正在yarn install安装依赖, 可能需要2min, 请耐心等待...');
    await installYarnDeps(nodeExec, yarnExec, pluginsDir);
    await s.reply('依赖安装完成, 成功加载小白兔🐰通用模块');
}
// 依赖管理
(async () => {
    const plt = await s.getPlatform();
    if (plt === '*') {
        await installDeps().catch(err => {
            console.error('依赖安装失败:', err);
        });

        await register().catch(err => {
            console.error('Web服务注册失败:', err);
        });
        return;
    }
    const content = await s.getContent();
    if (content === '修复依赖') {
        await installDeps().catch(err => {
            console.error('依赖安装失败:', err);
        });
        return;
    }
})();