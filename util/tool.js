import { request } from "./index";
import superagent from "superagent";
import superagentProxy from 'superagent-proxy';
import { XBIHOST, eobzzHOST, headers } from '../config';
superagentProxy(superagent)

function setpar(params) {
    var conf = { proxy: params.proxy, userAgent: params.userAgent }
    delete params.proxy;
    delete params.userAgent
    return {
        conf,
        params
    }
}
export default {
    getCookie(params) {
        var { conf, params } = setpar(params);
        console.log("conf:", conf, params);
        return request(Object.assign({
            url: params.url || 'http://ip.chinaz.com/getip.aspx',
            type: 'get',
            headers: headers,
            cookie: params.cookie || ''
        }, conf))
    },
    checkReg(cookie, params) {
        var { conf, params } = setpar(params);
        return request(Object.assign({
            url: XBIHOST + '/reg/check_moble.html',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            cookie: cookie
        }, conf))
    },
    register(cookie, params) {
        var { conf, params } = setpar(params);
        return request(Object.assign({
            url: XBIHOST + '/reg/reg_up.html',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            cookie: cookie
        }, conf))
    },
    getCode(cookie, params) {
        var { conf, params } = setpar(params);
        return new Promise((resolve, reject) => {
            var sa = superagent.get(XBIHOST + '/ajax/verify.html?t=' + Math.random())
                .set("Cookie", cookie)
                .set(headers)
                .set('User-Agent', conf.userAgent)
                .proxy(pconf.proxy)
                .end((err, res) => {
                    console.log("body", res.body)
                    resolve(res.body)
                    reject(err);
                })
            console.log("sa=", sa);
            console.log("conf=", conf);
            console.log("params=", params);
        })
    },

    setUserName(cookie, params) {
        var { conf, params } = setpar(params);
        return new Promise((resolve, reject) => {
            var sa = superagent.post(XBIHOST + '/reg/paypassword_up.html')
                .set("Cookie", cookie)
                .set('User-Agent', conf.userAgent)
                .proxy(conf.proxy)
                .type('form')
                .send(params)
                .end((err, res) => {
                    resolve(res.body)
                    reject(err);
                })
            console.log(sa);
        })
    },
    SMScode(cookie, params) {
        var { conf, params } = setpar(params);
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