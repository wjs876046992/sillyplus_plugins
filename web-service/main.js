/**
 * @name 小白兔🐰通用模块(必须安装)
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 2.1.0
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
 * v2.0.3 增加Pagermaid-Pyro适配器Node版，地址为 post http://ip:30000/bot/pagermaid，默认需手动开启
 * v2.1.0 修改配置参数名称，更加语义化；修改企业微信客服媒体发送问题；增加企业微信应用适配器，地址为 post http://ip:30000/api/bot/qywxyy，默认需手动开启
 * @rule 修复依赖
 * @form {key: "jd_sign.sign_host", title: "JD签名地址" , tooltip: "资产通知、查询等需要的h5st和sign，没有则使用内置", required: false}
 * @form {key: "jd_sign.proxy_url", title: "获取代理的地址" , tooltip: "资产通知、查询等需要的代理，支持星空、携趣等", required: false}
 * @form1 {key: "notice.wx", title: "全局wx通知开关", tooltip: "比如每天资产通知时会推送农场成熟", valueType: 'switch'}
 * @form1 {key: "notice.qq", title: "全局qq通知开关", tooltip: "比如每天资产通知时会推送农场成熟", valueType: 'switch'}
 * @form1 {key: "notice.wxpusher", title: "全局WxPusher开关", tooltip: "比如每天资产通知时会推送农场成熟", valueType: 'switch'}
 * @form1 {key: "notice.wxpusher_token", title: "全局WxPusher Token", tooltip: "关注WxPusher消息推送平台获取"}
 * @form {key: "web_service.proxy_url", title: "当前服务的反代地址", tooltip: "用于生成回调URL", required: false}
 * @form {key: "web_service.PORT", title: "监听端口", tooltip: "监听端口，建议通过反向代理暴露，默认30000", required: false, type: "digit"}
 * @form {key: "web_service.qywxkf_enabled", title: "【企业微信客服】启用适配器", tooltip: "参考文档 https://developer.work.weixin.qq.com/document/path/94638", required: false, valueType: 'switch'}
 * @form {key: "qywxkf.token", title: "【企业微信客服】Token", tooltip: "回调配置-Token", required: true}
 * @form {key: "qywxkf.aesKeyEncoding", title: "【企业微信客服】EncodingAESKey", tooltip: "回调配置-EncodingAESKey", required: true}
 * @form {key: "qywxkf.corpid", title: "【企业微信客服】企业ID" , tooltip: "开发者信息-企业ID", required: true}
 * @form {key: "qywxkf.corpsecret", title: "【企业微信客服】Secret", tooltip: "开发者信息-Secret", required: true}
 * @form {key: "web_service.qywxyy_enabled", title: "【企业微信应用】启用适配器", tooltip: "参考文档 https://developer.work.weixin.qq.com/document/path/90226", required: false, valueType: 'switch'}
 * @form {key: "qywxyy.token", title: "【企业微信应用】Token", tooltip: "回调配置-Token", required: true}
 * @form {key: "qywxyy.aesKeyEncoding", title: "【企业微信应用】EncodingAESKey", tooltip: "回调配置-EncodingAESKey", required: true}
 * @form {key: "qywxyy.corpid", title: "【企业微信应用】企业ID" , tooltip: "开发者信息-企业ID", required: true}
 * @form {key: "qywxyy.corpsecret", title: "【企业微信应用】Secret", tooltip: "开发者信息-Secret", required: true}
 * @form1 {key: "web_service.wcf_enabled", title: "启用wcf适配器", tooltip: "wcf微信机器人", required: false, valueType: 'switch'}
 * @form1 {key: "wx.wcf_host", title: "WeChat Ferry机器人HTTP地址", required: true}
 * @form {key: "web_service.tb_relation_auth_enabled", title: "【淘宝渠道备案】启用回调", tooltip: "暴露一个回调地址，搭配“淘宝渠道备案”插件使用", required: false, valueType: 'switch'}
 * @form {key: "web_service.wxpusher_enabled", title: "【返利注册】启用wxpusher回调", tooltip: "暴露一个回调地址，搭配“返利注册”插件使用", required: false, valueType: 'switch'}
 * @form {key: "web_service.pgp_enabled", title: "【Pagermaid-Pyro】启用适配器", tooltip: "默认不启用", required: false, valueType: 'switch'}
 * @form {key: "pmp.ws_reverse", title: "【Pagermaid-Pyro】链接地址", tooltip: "傻妞的通讯地址用于生成插件，请如实填写，写错概不负责。", required: true}
 * @form {key: "pmp.secure_token", title: "【Pagermaid-Pyro】安全Token", tooltip: "用于安全验证，自动生成。", required: true}
 * @form {key: "pmp.disable_apt_source", title: "【Pagermaid-Pyro】禁用插件源", valueType: 'switch', tooltip: "对接成功后自动禁用插件源，后续升级需要该选项打开一下。", required: true}
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
const getRawBody = require('raw-body');
const jsonBigInt = require('json-bigint')({"storeAsString": true});


async function supportRegister(app, webServiceDB) {

    const PluginManager = require('./modules/PluginManager');
    const pluginManager = new PluginManager(app, '/api/bot');

    // reload cached remote plugins
    const registeredPlugins = await webServiceDB.get('registered_plugins', {});
    for (const [name, filePath] of Object.entries(registeredPlugins)) {
        try {
            await pluginManager.register(name, filePath);
            registeredPlugins[name] = filePath;
        } catch (e) {
            delete registeredPlugins[name];
        }
    }
    await webServiceDB.set('registered_plugins', registeredPlugins);

    // 允许注册插件
    app.post('/api/plugins/register', async (req, res) => {
        const body = req.body;
        try {
            const registeredPlugins = await webServiceDB.get('registered_plugins', {});
            for (const [name, plugin] of Object.entries(body)) {
                await pluginManager.register(name, plugin);
                registeredPlugins[name] = plugin;
            }
            await webServiceDB.set('registered_plugins', registeredPlugins);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Error registering plugin');
        }

        return res.status(200).send('Plugin registered');
    });
    app.post('/api/plugins/unregister', async (req, res) => {
        const {name} = req.body;
        try {
            pluginManager.unregister(name);
            const registeredPlugins = await webServiceDB.get('registered_plugins', {});
            if (registeredPlugins[name]) {
                console.log(`Unregistering plugin: ${name}, file: ${registeredPlugins[name]}`);
                delete registeredPlugins[name];
                await webServiceDB.set('registered_plugins', registeredPlugins);
            }
            res.send(`Plugin "${name}" unregistered.`);
        } catch (err) {
            res.status(500).send(err.message);
        }
        return res.status(200).send('Success: Plugin registered');
    });
    // 查询已注册插件
    app.get('/api/plugins/list', (req, res) => {
        res.json(pluginManager.list());
    });
}

const register = async () => {
    const http = require('http'), net = require('net'), Express = require('express'), WebSocket = require('ws');

    /**
     * 检查端口是否被占用
     * @param port 端口号
     * @returns {Promise<unknown>}
     */
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

    /**
     * 获取占用端口的进程ID并终止
     * @param port 端口号
     * @returns {Promise<string>}
     */
    const killProcessUsingPort = async (port) => {
        try {
            // 查找占用端口的进程PID
            const {stdout} = await exec(`lsof -t -i:${port}`);
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

    /**
     * 检查是否可以运行服务器
     * @param port 端口号
     * @throws {Error} 如果端口被占用且无法终止进程
     * @returns {Promise<void>}
     */
    async function checkCanRun(port) {
        let canRun = false;
        try {
            await checkPort(port);
            canRun = true;
        } catch (err) {
            console.log(err);
            console.log(`尝试终止占用端口的进程...`);
            try {
                const killMsg = await killProcessUsingPort(port);
                console.log(killMsg);
                canRun = true;
            } catch (killErr) {
                console.log(killErr);
            }
        }

        if (!canRun) {
            throw Error(`无法启动服务器，端口 ${PORT} 已被占用`);
        }
    }


    const webServiceDB = new Bucket('web_service');
    let PORT = await webServiceDB.get('PORT');
    if (!PORT) { // 初始化端口，并保存到数据库
        PORT = 30000;
        await webServiceDB.set('PORT', PORT);
    }

    await checkCanRun(PORT);

    const app = new Express();
    app.get('/health', (req, res) => {
        res.status(200).send('Web service is running');
    });

    // 设置 Express 中间件, 用于解析 JSON 请求体, big int 支持
    app.use(async (req, res, next) => {
        if (
            req.headers['content-type'] &&
            req.headers['content-type'].includes('application/json')
        ) {
            try {
                const raw = await getRawBody(req, {
                    length: req.headers['content-length'],
                    limit: '1mb',
                    encoding: 'utf-8'
                });

                req.rawBody = raw;
                req.body = jsonBigInt.parse(raw, null); // 使用 json-bigint 解析 JSON
            } catch (err) {
                return res.status(400).send('Invalid JSON');
            }
        }
        next();
    });

    // inner route: 企业微信客服、WeChat Ferry、淘宝渠道备案、wxpusher返利注册
    const modules = require('./modules');
    for (const [name, module] of Object.entries(modules)) {
        const enabled = await webServiceDB.get(`${name}_enabled`, false);  // 根据模块名获取启用状态
        console.log(`模块 ${name} 启用状态：${enabled}`);
        if (enabled && typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module(app);  // 执行模块并传入 app
        }
    }
    // 添加插件注册功能
    await supportRegister(app, webServiceDB);

    /**
     * 设置事件监听器
     * 创建 HTTP 服务器和 WebSocket 服务器，并监听连接和消息事件
     * @param expressApp Express 应用实例
     * @returns {Promise<void>}
     * @throws {Error} 如果端口被占用且无法终止进程
     * @description 该函数创建一个 HTTP 服务器，并在其上创建一个 WebSocket 服务器。
     * 它监听 WebSocket 连接事件，并在连接时设置消息监听器。
     * 当接收到消息时，它会打印消息内容并向客户端发送回应。
     * 当 WebSocket 连接关闭时，它会打印连接关闭的消息。
     * 最后，它启动 HTTP 服务器并监听指定端口。
     * @example
     * setEventListener();
     * // 调用该函数后，服务器将开始监听 WebSocket 连接和消息
     */
    async function setEventListener(expressApp) {
        // 创建 HTTP 服务器
        const server = http.createServer(expressApp);
        const pgp_enabled = await webServiceDB.get('pgp_enabled', false);
        if (pgp_enabled) {
            const pagermaid = require('./modules/pagermaid');
            await pagermaid(server, app);
        }

        server.listen(PORT, () => {
            console.log(`服务器正在运行，支持 HTTP 和 WebSocket，端口: ${PORT}`);
        });
    }

    await setEventListener(app);
};

const {spawn} = require('child_process');

const installYarnDeps = (nodeExec, yarnExec, pluginsDir) => {
    return new Promise((resolve, reject) => {
        const child = spawn(nodeExec, [`${yarnExec}.js`, 'install'], {cwd: pluginsDir});

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
            "mongoose": "^6.13.8",
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
    const {
        stdout,
        stderr
    } = await exec(`${nodeExec} ${yarnExec}.js config set registry https://registry.npmmirror.com`, {cwd: pluginsDir});
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