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
        var { conf } = setpar(params);
        return request(Object.assign({
            url: url || XBIHOST,
            type: 'get',
            headers: headers,
            cookie: cookie || ''
        }, conf))
    },
    checkReg(cookie, params) {
        var { conf } = setpar(params);
        return request(Object.assign({
            url: XBIHOST + '/reg/check_moble.html',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            cookie: cookie
        }, conf))
    },
    register(cookie, params) {
        var { conf } = setpar(params);
        return request(Object.assign({
            url: XBIHOST + '/reg/reg_up.html',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            cookie: cookie
        }, conf))
    },
    getCode(cookie, params) {
        var params = setpar(params);
        return new Promise((resolve, reject) => {
            superagent.get(XBIHOST + '/ajax/verify.html?t=' + Math.random())
                .set("Cookie", cookie)
                .set(headers)
                .set('User-Agent', params.conf.userAgent)
                .proxy(params.conf.proxy)
                .end((err, res) => {
                    console.log("body", res.body)
                    resolve(res.body)
                    reject(err);
                })
        })
    },

    setUserName(cookie, params) {
        var params = setpar(params);
        return new Promise((resolve, reject) => {
            var sa = superagent.post(XBIHOST + '/reg/paypassword_up.html')
                .set("Cookie", cookie)
                .set('User-Agent', params.conf.userAgent)
                .proxy(params.conf.proxy)
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
        var params = setpar(params);
        return new Promise((resolve, reject) => {
            superagent.post(XBIHOST + '/verify/moble_reg.html')
                .set("Cookie", cookie)
                .set('User-Agent', params.conf.userAgent)
                .proxy(params.conf.proxy)
                .type('form')
                .send(params)
                .end((err, res) => {
                    resolve(res.body)
                    reject(err);
                })
        })
    }
}