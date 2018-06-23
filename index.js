var express = require('express');
var app = express();
var distCode = require('./code');
const rua = require('random-useragent');
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
import { getPassWord, getUserName, tool } from './util';
import ip from './util/ip';
const bodyParser = require('body-parser');
import sms from './sms';
app.set('views', './views')
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: { maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));
let pubParams = {
    mobles: '+86',
}
app.get('/', async function (req, res, next) {
    res.render('index');
    if (req.path !== "/") return;
    let num = await sms.getMobilenum({
        action: 'getMobilenum'
    });
    let mft = num.data.split('|');
    let cookie = await tool.getCookie(params);
    cookie = cookie.headers["set-cookie"];
    cookie = cookie.join(',').match(/(PHPSESSID=.+?);/)[1];
    pubParams = Object.assign(pubParams, { moble: mft[0] }, new ip().getUseLineIp())
    console.log("==============start====================")
    console.log("mft:", mft, "pubParans:", JSON.stringify(pubParams));
    console.log('==============end=======================')
    refreshVerify(cookie);
})
var count = 0;
async function refreshVerify(cookie, phone) {
    if ((count = count + 1) && count > 3) return (count = 0);
    let code = await tool.getCode(cookie, params);
    let filePath = './avatar.png';
    let flie = fs.writeFileSync(filePath, code);
    let verCode = await distCode.getCode({
        'username': 'qiyi1990108',
        'password': 'qiyi1990107',
        filename: filePath
    })

    let isReg = await tool.checkReg(cookie, pubParams);
    let isSend = await tool.SMScode(cookie, Object.assign({}, pubParams, { type: 'sms', verify: verCode.Result }))
    if (!+isSend.status) refreshVerify(cookie)
    new Promise((resolve, reject) => {
        setTimeout(async () => {
            let getVcode = await sms.getMobilenum({ action: 'getVcodeAndReleaseMobile', mobile: pubParams.moble });
            let code = getVcode.data.split('|')[1];
            code = code.substr(code.length - 6, 6);
            resolve(code)
        }, 30000);
    }).then(code => {
        let conf = Object.assign({}, pubParams, { moble_verify: code, password: getPassWord(10, 12), invit: 'MQ896628' });
        var params = JSON.stringify(conf);
        console.log('INFO:', params, cookie);
        return tool.register(cookie, conf)
    }).then(async res => {
        cookie = cookie + '; move_moble=' + pubParams.moble + '; move_mobles=%2B86;';
        let params = {
            username: getUserName(),
            paypassword: getUserName(5)
        }
        return tool.setUserName(cookie, params)

    }).then(res => {
        console.log(res);
    })
}

var server = app.listen(9000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});