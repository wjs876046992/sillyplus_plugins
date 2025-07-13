/**
 * @name 同步CK
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.2
 * @description 在qinglong存储中的相互同步
 * v1.0.0 init
 * v1.0.1 适配qinglong存储
 * v1.0.2 调整key存储桶位置，避免和现有的qinglong存key冲突
 * @rule raw ^(?i)同步ck$
 * @form {key: "ck_sync.from_client_id", title: "来源青龙client_id", tooltip: "逗号分隔，不配置标识不同步"}
 * @form {key: "ck_sync.to_client_id", title: "目标青龙client_id", tooltip: "逗号分隔，不配置标识不同步"}
 * @public false
 * @admin true
 * @disable true
 * @encrypt false
 * @class 青龙
 * @create_at 2099-01-01 14:58:00
 * @icon https://user-images.githubusercontent.com/22700758/191449379-f9f56204-0e31-4a16-be5a-331f52696a73.png
 */

const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();

