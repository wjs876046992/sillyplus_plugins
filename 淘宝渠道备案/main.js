global.sillygirl = require('sillygirl');
/**
 * @name 淘宝渠道备案
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version 1.0.1
 * @description 用于生成用户专属的淘宝渠道ID。淘宝渠道ID用于淘宝订单跟单，便于结算返佣金。该授权不能使用返利的淘宝主账号，需要额外一个淘宝号进行授权。
 * v1.0.0 初始化
 * v1.0.1 增加插件使用描述
 * @rule 淘宝渠道备案
 * @form {key: "fanli.mongodb", "title": "Mongodb地址", required: true, tooltip:"MongoDB版本大于4.0，例：mongodb://localhost:27017"}
 * @form {key: "fanli.tb_pid", "title": "淘客PID", tooltip: "mm_xxx_xxx_xxx,三段格式，必须与授权的账户相同，否则出错", required: true}
 * @form {key: "fanli.tb_zhetaoke_sid", "title": "淘客授权SID", tooltip:"对应的淘客账号授权ID", required: true}
 * @form {key: "fanli.tb_zhetaoke_appkey", "title": "折淘客APP_KEY", tooltip: "折淘客的对接秘钥appkey", required: true}
 * @admin false
 * @public true
 * @disable false
 * @encrypt false
 * @class 返利
 * @service true
 * @http GET /api/tb-relation-auth/callback
 * @icon https://img.icons8.com/?size=100&id=7JqGStkfQDtJ&format=png&color=000000
 * @create_at 2099-01-01 14:51:50
 */

const {Bucket, console} = require('@mod/platform');
const {MongoConnection, User, SeqCounter, ModelService} = require('@mod/mongodb');
const http = require('http');
const url = require('url');

const port = parseInt(process.env.HTTP_LISTEN_PORT || '30000', 10);


const { start } = require('./modules');

!(async () => {
    await start();
})();
