var express = require('express');
var app = express();
var code = require('./code');
const rua = require('random-useragent');
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
import { request, tool } from './util';
const bodyParser = require('body-parser');
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



// var getCodeFile = function (cookie) {
//     request({
//         url: 'http://www.xbi.cc/ajax/verify.html' + '?t=' + Math.random(),
//         type: 'get',
//         headers: Object.assign(headers)
//     }).then(res => {
//         console.log(res);
//     })
// }

app.use('*', async function (req, res, next) {
    res.render('index');
    if (!req.session.regCookie) {
        let cookie = await tool.getCookie();
        cookie = cookie.headers["set-cookie"];
        req.session.regCookie = cookie;
    }
    console.log(req.session.regCookie);
})


async function test(req) {


}


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
    // getCodeFile();
});