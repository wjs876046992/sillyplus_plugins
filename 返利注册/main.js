global.sillygirl = require('sillygirl');
/**
 * @name 返利注册
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description 接收 WxPusher 返利注册回调。
 * @public true
 * @disable false
 * @service true
 * @http GET /api/wxpusher/fanli-register
 * @http POST /api/wxpusher/fanli-register
 * @create_at 2099-01-01 12:10:49
 * @icon https://img.icons8.com/?size=100&id=84804&format=png
 */

const {Bucket} = require('@mod/platform');
const {MongoConnection, User} = require('@mod/mongodb');
const http = require('http');
const url = require('url');

const port = parseInt(process.env.HTTP_LISTEN_PORT || '30000', 10);


const { start } = require('./modules');

!(async () => {
    await start();
})();
