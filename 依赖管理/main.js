/**
 * @name 依赖管理
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 1.0.0
 * @description 该插件会自动安装小白兔插件所须依赖，所以需要时间比较长，安装时请耐心等待。
 * v1.0.0 删除dev依赖，修复依赖调整
 * @rule 修复依赖
 * @public true
 * @admin true
 * @on_start true
 * @disable false
 * @encrypt false
 * @class 机器人
 * @create_at 2099-01-01 20:20:00
 * @icon https://img.icons8.com/?size=100&id=DJWlbd0VP2As&format=png&color=000000
 */
const {console, sender: s} = require('sillygirl');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
let plt, messages = [];

const _log = async (msg) => {
    if (plt === '*') {
        console.log(msg);
    } else if (plt) {
        // await s.reply(msg);
        messages.push(msg);
    }
}

function spawnExec(command, args = [], options = {}) {
    const {
        cwd,
        env,
        stdio = 'pipe',
        shell = false
    } = options;

    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd,
            env: {...process.env, ...env},
            stdio,
            shell
        });

        let stdout = '';
        let stderr = '';

        if (child.stdout) {
            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });
        }

        if (child.stderr) {
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });
        }

        child.on('error', (err) => {
            reject(err);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve({stdout, stderr, code});
            } else {
                const error = new Error(`Command failed: ${command} ${args.join(' ')}`);
                error.code = code;
                error.stdout = stdout;
                error.stderr = stderr;
                reject(error);
            }
        });
    });
}

const installYarnDeps = async (nodeExec, yarnExec, pluginsDir) => {
    const {stdout, stderr} = await spawnExec(
        yarnExec,
        [
            'install',
            '--force',
            '--no-bin-links'
        ],
        {
            cwd: pluginsDir
        }
    );

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
};

const installDeps = async () => {
    // 获取父目录路径 => /path/to/plugins
    const pluginsDir = path.resolve(__dirname, '..');
    await _log(`插件目录: ${pluginsDir}`);

    // 检查父目录是否存在 package.json
    const packageJsonPath = path.join(pluginsDir, 'package.json');
    await _log(`检查 package.json 文件: ${packageJsonPath}`);

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
            "axios": "^1.13.5",
            "crypto-js": "^4.1.1",
            "https-proxy-agent": "^7.0.6",
            "moment": "^2.29.4",
            "mongoose": "^6.13.8",
            "qs": "^6.14.2",
            "uuid": "^9.0.1"
        },
        "devDependencies": {}
    };
    // 写入 package.json 文件
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 4), {encoding: 'utf8'});
    await _log(`已创建 package\.json 文件`)

    // 设置 Yarn registry
    const {
        stdout,
        stderr
    } = await spawnExec(
        'yarn',
        [
            'config',
            'set',
            'registry',
            'https://registry.npmmirror.com'
        ],
        {
            cwd: pluginsDir,
            stdio: ['ignore', 'pipe', 'pipe']
        }
    );
    if (stderr) {
        console.error(`exec error: ${stderr}`);
        await _log(stderr);
        return;
    }
    console.log(`stdout: ${stdout}`);
    await _log('已设置 Yarn registry 为 https://registry.npmmirror.com');

    // 执行 yarn install
    await _log('正在yarn install安装依赖, 可能需要2min, 请耐心等待...');
    await installYarnDeps('node', 'yarn', pluginsDir);
    await _log('依赖安装完成');
}
// 依赖管理
(async () => {
    plt = await s.getPlatform();
    messages = [];
    const content = await s.getContent();
    console.log(`install deps... plt = ${plt}, content = ${content}`);
    if (plt === '*' || content === '修复依赖') {
        await installDeps();
    }
    if (messages.length > 0) {
        await s.reply(messages.join('\n'));
    }
})();