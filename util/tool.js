import { request } from "./index";
import superagent from "superagent";
import { XBIHOST, eobzzHOST, headers } from '../config';
import { rejects } from "assert";
var browserMsg = {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36",
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};
export default {
    getCookie() {
        return request({
            url: XBIHOST,
            type: 'get',
            headers: headers
        })
    },
    checkReg(cookie, params) {
        return request({
            url: XBIHOST + '/reg/check_moble.html',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            cookie: cookie
        })
    },
    getCode(cookie) {
        return new Promise((resolve, reject) => {
            superagent.get(XBIHOST + '/ajax/verify.html?t=' + Math.random())
                .set("Cookie", cookie)
                .set(headers)
                .end((err, res) => {
                    console.log("body", res.body)
                    resolve(res.body)
                    reject(err);
                })
        })
    },
    SMScode(cookie, params) {
        return new Promise((resolve, reject) => {
            superagent.post(XBIHOST + '/verify/moble_reg.html')
                .set("Cookie", cookie)
                .set("User-Agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36")
                .type('form')
                .send(params)
                .end((err, res) => {
                    resolve(res.body)
                    reject(err);
                })
        })

        // return request({
        //     url: XBIHOST + '/verify/moble_reg.html',
        //     params: params,
        //     headers: Object.assign(headers, { 'Content-Type': 'application/json;charset=UTF-8' }),
        //     cookie: cookie
        // })
    }
}