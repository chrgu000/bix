import { request } from "./index";
import superagent from "superagent";
import { XBIHOST, eobzzHOST, headers } from '../config';
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
        return request({
            url: XBIHOST + '/ajax/verify.html?t=' + Math.random(),
            headers: Object.assign(headers, { cookie: cookie })
        })
    },
    SMScode(cookie, params) {
        console.log("SMScode=", cookie);
        return request({
            url: XBIHOST + '/verify/moble_reg.html',
            params: params,
            headers: Object.assign(headers, { 'Content-Type': 'application/json;charset=UTF-8' }),
            cookie: cookie
        })
    }
}