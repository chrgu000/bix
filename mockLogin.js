import superagent from 'superagent';
import { resolve } from 'dns';
import { headers } from './config';
export function getCookie() {
    return new Promise((resolve, reject) => {
        superagent.get('http://www.xbi.cc').set(headers).redirects(0).end((err, res) => {
            console.log("mockLogin",res.headers);
            resolve({ cookie: res.headers["set-cookie"]});
        })
    })
}