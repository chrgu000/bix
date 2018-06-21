import { request } from "./index";
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
            url: XBIHOST + '/verify/check_moble.html',
            type: 'post',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8', cookie: cookie }
        })
    },

    SMScode(cookie, params) {
        return request({
            url: XBIHOST + '/verify/check_moble.html',
            type: 'post',
            params: params,
            headers: { 'Content-Type': 'application/json;charset=UTF-8', cookie: cookie }
        })
    }
}