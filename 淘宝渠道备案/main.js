global.sillygirl = require('sillygirl');
/**
 * @name 淘宝渠道备案
 * @author 落幕尽繁华
 * @origin 小白兔🐰
 * @version v1.0.0
 * @description 接收淘宝渠道备案回调，登记备案信息。
 * @public true
 * @disable false
 * @service true
 * @http GET /api/tb-relation-auth/callback
 * @create_at 2099-01-01 12:10:49
 * @icon https://img.icons8.com/?size=100&id=84804&format=png
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
