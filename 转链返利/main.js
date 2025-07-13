/**
 * @name 转链返利
 * @origin 小白兔🐰
 * @author 落幕尽繁华
 * @version v1.1.6
 * @description 京东、淘宝、拼多多，转链返利
 * v1.0.0 初始化
 * v1.0.1 支持京东3.cn, u.jd.cn
 * v1.0.2 支持11和16位京东口令
 * v1.0.3 佣金显示规则：1）显示佣金开关开启 2）指定群聊显示佣金 3）私聊仅对管理员显示佣金开关开启
 * v1.0.4 -s 开启当前群聊佣金显示；-h 关闭当前群聊佣金显示
 * v1.0.5 链接查找不到商品时给出提示
 * v1.0.6 加入MongoDB存储用户信息，增加京东、淘宝、拼多多渠道ID跟单
 * v1.0.7 拼多多转链返利查看bug
 * v1.0.8 增加开关：支持将链接转为二维码
 * v1.0.9 返利逻辑调整：关闭“仅对管理员显示佣金”时，对所有用户显示“佣金”
 * v1.1.0 增加转链显示“【返佣金】”，佣金比例；增加小帽子和小尾巴
 * v1.1.1 解决京东u.jd.com转链跟单问题
 * v1.1.2 京东口令商品解析逻辑调整
 * v1.1.2-alpha.1 bugfix: 拼多多无返利时，显示返回信息错误
 * v1.1.2-alpha.2 u.jd.com解析出来i-item.jd.com时无法转链问题
 * v1.1.3 修复京品库API参数不支持长链接问题，默认使用京品库，当是长链接时使用折京客
 * v1.1.4 增加京品库口令是否生成配置，默认不生成
 * v1.1.4-alpha.1 修复个小问题
 * v1.1.4-alpha.2 修复存在批量转链时，跟单问题
 * v1.1.5 增加饿了么和美团优惠券链接
 * v1.1.6 京品库链接从https改为http
 * @rule ^\-s$|^\-h$
 * @rule ^mt$|^meituan$|^美团$
 * @rule ^elm$|^eleme$|^饿了么$
 * @rule raw (https?:\/\/[^\s<>]*(taobao\.|tb\.)[^\s<>]+|[^一-龥0-9a-zA-Z=;&?-_.<>:'",{}][0-9a-zA-Z()]{11}[^一-龥0-9a-zA-Z=;&?-_.<>:'",{}\s])
 * @rule raw (https?:\/\/[^\s<>]*(3\.cn|jd\.|jingxi)[^\s<>]+|[^一-龥0-9a-zA-Z=;&?-_.<>:'",{}][0-9a-zA-Z()]{16}[^一-龥0-9a-zA-Z=;&?-_.<>:'",{}\s])
 * @rule raw (https?:\/\/[^\s<>]*(yangkeduo|pinduoduo)[^\s<>]+)
 * @priority 999
 * @form {key: "fanli.mongodb", "title": "Mongodb地址", required: true, tooltip:"MongoDB版本大于4.0，例：mongodb://localhost:27017"}
 * @form {key: "fanli.bj_show_yj", title: "显示佣金", valueType: 'switch'}
 * @form {key: "fanli.bj_show_yj_group_ids", title: "显示佣金的群聊ID", tooltip: "多个群聊ID用英文逗号分隔，不管是不是管理员发送，都显示佣金。其他群聊一律不显示佣金"}
 * @form {key: "fanli.bj_show_yj_to_admin", title: "仅对管理员显示佣金", valueType: 'switch', tooltip: "私聊。发送人是管理员则显示佣金"}
 * @form {key: "fanli.bj_ignore_noyj", title: "隐藏无佣金链接", valueType: 'switch', tooltip: "转链无佣金时不显示链接，返回”暂无商品优惠信息～，换一个吧“"}
 * @form {key: "fanli.bj_show_image", title: "显示图片", valueType: 'switch', tooltip: "关闭则不显示商品宣传图片"}
 * @form {key: "fanli.link_to_qrcode", title: "链接转二维码", valueType: 'switch', tooltip: "默认关闭，开启则链接转二维码"}
 * @form {key: "fanli.bj_head", title: "文案头部"}
 * @form {key: "fanli.bj_tail", title: "小尾巴"}
 * @form {key: "fanli.tb_pid", "title": "淘客PID", tooltip: "mm_xxx_xxx_xxx,三段格式，必须与授权的账户相同，否则出错", required: true}
 * @form {key: "fanli.tb_relation_id", "title": "淘宝渠道关系ID", tooltip: "非必填，仅适用于淘宝渠道推广场景。没有则不能解析短链接，建议申请。每个用户代表一个，未进行淘宝渠道备案用户使用该默认值"}
 * @form {key: "fanli.tb_zhetaoke_sid", "title": "淘客授权SID", tooltip:"对应的淘客账号授权ID，代理那个授权", required: true}
 * @form {key: "fanli.tb_zhetaoke_appkey", "title": "折淘客APP_KEY", tooltip: "折淘客的对接秘钥appkey", required: true}
 * @form {key: "fanli.tb_rake", "title": "淘宝返佣比例", required: true, valueType: "digit", tooltip:"默认0"}
 * @form {key: "fanli.jd_union_id", "title": "京东联盟ID", required: true}
 * @form {key: "fanli.jd_jingpinku_appid", "title": "京品库APP_ID", required: true}
 * @form {key: "fanli.jd_jingpinku_appkey", "title": "京品库APP_KEY", required: true}
 * @form {key: "fanli.jd_rake", "title": "京东返佣比例", required: true, valueType: "digit", tooltip:"默认0"}
 * @form {key: "fanli.jd_kl", "title": "是否京东生成口令", valueType: "switch", tooltip:"默认不生成，只有配置京品库相关参数才能生成"}
 * @form {key: "fanli.pdd_client_id", "title": "多多进宝ClientID", required: true}
 * @form {key: "fanli.pdd_client_secret", "title": "多多进宝ClientSecret", required: true}
 * @form {key: "fanli.pdd_pid", "title": "多多进宝推广位PID", required: true}
 * @form {key: "fanli.pdd_rake", "title": "拼多多返佣比例", required: true, valueType: "digit", tooltip:"默认0"}
 * @form1 {key: "jd_sign.proxy_url", "title": "京东接口请求使用代理", required: false, tooltip: "没有也无所谓"}
 * @form1 {key: "jd_sign.sign_host", "title": "京东App接口签名算法", required: false, tooltip: "没有也无所谓，不能解析京东口令"}
 * @public true
 * @admin false
 * @disable false
 * @encrypt false
 * @class 返利
 * @icon https://img.icons8.com/?size=100&id=8LzqpRXSK_ZK&format=png&color=000000
 * @create_at 2099-01-01 14:50:50
 */

const modules = require('./modules');

(async () => {
    for (const [name, module] of Object.entries(modules)) {
        if (typeof module === 'function') {  // 如果模块启用且是可调用函数
            await module();  // 执行模块
        }
    }
})();