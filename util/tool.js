import { request } from "./index";
import superagent from "superagent";
import superagentProxy from 'superagent-proxy';
import { XBIHOST, eobzzHOST, headers } from '../config';
import colors from 'colors';
superagentProxy(superagent)

function setpar(params, fn) {
    var params = JSON.parse(JSON.stringify(params))
    console.log(colors.red('=================tool-请求的参数================'))
    console.log(fn, colors.green(params))
    var conf = { proxy: params.proxy, userAgent: params.userAgent }
    delete params.proxy;
    delete params.userAgent
    console.log(colors.red('=================tool-请求的完成================'))
    return {
        conf,
        params
    }
}
export default {
    getCookie(params) {
        var { conf, params } = setpar(params, 'getCookie');
        return request(Object.assign({
            url: params.url || XBIHOST,
            type: 'get',
            headers: headers,
            cookie: params.cookie || ''
        }, conf))
    },
    checkReg(cookie, params) {
        var { conf, params } = setpar(params, 'checkReg');
        return request(Object.assign({
            url: XBIHOST + '/reg/check_moble.html',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            cookie: cookie
        }, conf))
    },
    register(cookie, params) {
        var { conf, params } = setpar(params, 'register');
        return request(Object.assign({
            url: XBIHOST + '/reg/reg_up.html',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            cookie: cookie
        }, conf))
    },
    getCode(cookie, params) {
        var { conf, params } = setpar(params, 'getCode');
        return new Promise((resolve, reject) => {
            var sa = superagent.get(XBIHOST + '/ajax/verify.html?t=' + Math.random())
                .set("Cookie", cookie)
                .set(headers)
                .set('User-Agent', conf.userAgent)
                .proxy(conf.proxy)
                .end((err, res) => {
                    console.log("body", res.body)
                    resolve(res.body)
                    reject(err);
                })
        })
    },

    setUserName(cookie, params) {
        var { conf, params } = setpar(params, 'setUserName');
        return new Promise((resolve, reject) => {
            superagent.post(XBIHOST + '/reg/paypassword_up.html')
                .set("Cookie", cookie)
                .set('User-Agent', conf.userAgent)
                .proxy(conf.proxy)
                .type('form')
                .send(params)
                .end((err, res) => {
                    resolve(res.body)
                    reject(err);
                })
        })
    },
    SMScode(cookie, params) {
        var { conf, params } = setpar(params, 'SMScode');
        return new Promise((resolve, reject) => {
            superagent.post(XBIHOST + '/verify/moble_reg.html')
                .set("Cookie", cookie)
                .set('User-Agent', conf.userAgent)
                .proxy(conf.proxy)
                .type('form')
                .send(params)
                .end((err, res) => {
                    resolve(res.body)
                    reject(err);
                })
        })
    }
}