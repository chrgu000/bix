var express = require('express');
var app = express();
var distCode = require('./code');
const rua = require('random-useragent');
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
import { getPassWord, identity, getUserName, tool } from './util';
import getIp from './util/ip';
const bodyParser = require('body-parser');
import colors from 'colors';
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
    console.log(10000000);

    let num = await sms.getMobilenum({
        action: 'getMobilenum'
    });
    console.log("num=", num.data);
    let mft = num.data.split('|');
    var ip = new getIp();
    var conf = await ip.getUseLineIp();
    let mp = Object.assign(pubParams, { moble: mft[0] }, conf)
    console.log('ppppppp', mp.proxy);
    let cookie = await tool.getCookie(mp);
    // console.log('cookie====',cookie)
    cookie = cookie.headers["set-cookie"];
    cookie = cookie.join(',').match(/(PHPSESSID=.+?);/)[1];
    console.log("==============start====================")
    console.log("mft:", mft, "conf:", conf, "pubParans:", JSON.stringify(pubParams));
    console.log('cookie', cookie);
    console.log('==============end=======================')
    refreshVerify(cookie);
})
var count = 0;
async function getVerCode(cookie) {
    let code = await tool.getCode(cookie, pubParams);
    let filePath = './avatar.png';
    let flie = fs.writeFileSync(filePath, code);
    return await distCode.getCode({
        'username': 'qiyi1990108',
        'password': 'qiyi1990107',
        filename: filePath
    })
}
async function refreshVerify(cookie, phone) {
    if ((count = count + 1) && count > 3) return (count = 0);
    let verCode = await getVerCode(cookie);
    // let isReg = await tool.checkReg(cookie, pubParams);
    let isSend = await tool.SMScode(cookie, Object.assign({}, pubParams, { type: 'sms', verify: verCode.Result }))
    console.log('isSend', cookie, verCode, isSend)
    if (!+isSend.status) return refreshVerify(cookie)
    new Promise((resolve, reject) => {
        setTimeout(async () => {
            let getVcode = await sms.getMobilenum({ action: 'getVcodeAndReleaseMobile', mobile: pubParams.moble });
            let code = getVcode.data.split('|')[1];
            code = code.substr(code.length - 6, 6);
            resolve(code)
        }, 30000);
    }).then(code => {
        let conf = Object.assign({}, pubParams, { moble_verify: code, password: getUserName(), invit: 'EK862314' });
        var params = JSON.stringify(conf);
        console.log('INFO:', params, cookie);
        return tool.register(cookie, conf)
    }).then(async res => {
        cookie = cookie + '; move_moble=' + pubParams.moble + '; move_mobles=%2B86;';
        let params = {
            username: getUserName(),
            paypassword: getUserName(5)
        }
        return tool.setUserName(cookie, Object.assign(params, pubParams))
    }).then(async res => {
        // tool.startlogin(cookie, Object.assign({ verify:getVerCode()}, pubParams))

        // tool.identity(cookie,Object.assign({}))
        console.log(res);
    })
}

var server = app.listen(9000, function () {
    var host = server.address().address;
    var port = server.address().port;
    fs.readFile('./ignore/useIdentity.json', 'utf-8', async function (err, data) {
        if (err) return console.log(err);
        var isUseIt = JSON.parse(data);
        let it = await identity();
        var cid = () => {
            let id = it.shift().split(',');
            return isUseIt[id[1]] ? cid() : (isUseIt[id[1]] = { truename: id[0], idcardtype: '身份证', idcard: id[1] });
        }
        var cp = cid();
        console.log(cp);
        return fs.writeFileSync('./ignore/useIdentity.json', JSON.stringify(isUseIt))
    })
    console.log('Example app listening at http://%s:%s', host, port);
});