var express = require('express');
var app = express();
var distCode = require('./code');
const rua = require('random-useragent');
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
import { request, tool } from './util';
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

app.get('/', async function (req, res, next) {
    res.render('index');
    if (req.path !== "/") return;
    if (!req.session.regCookie) {
        let cookie = await tool.getCookie();
        cookie = cookie.headers["set-cookie"];
        req.session.regCookie = cookie.join(',').match(/(PHPSESSID=.+?);/)[1];
    }
    let num = await sms.getMobilenum({
        action: 'getMobilenum'
    });
    let mft = num.data.split('|');
    let pubParams = {
        moble: mft[0],
        mobles: '+86',
    }
    let isReg = await tool.checkReg(req.session.regCookie, pubParams);
    let code = await tool.getCode(req.session.regCookie);
    let filePath = './avatar.jpg';
    let flie = fs.writeFileSync(filePath, code.body);
    console.log(req.session.regCookie);
    let verCode = await distCode.getCode({
        'username': 'qiyi1990108',
        'password': 'qiyi1990107',
        filename: filePath
    })
    let isSend = await tool.SMScode(req.session.regCookie, Object.assign(pubParams, { type: 'sms', verify: verCode.Result }))
    console.log(isSend.body);

})

var server = app.listen(9000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});