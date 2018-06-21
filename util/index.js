
var superagent = require('superagent');
import tool from './tool';
export function request(opts) {
    return new Promise((resolve, reject) => {
        superagent[opts.type || 'post'](opts.url)
            .set(opts.headers)
            .set('User-Agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36')
            .set('Cookie', opts.cookie || '')
            .type('form')
            .send(opts.params || {})
            .end((err, res) => {
                resolve(res)
            })
    })
}

export {
    tool
}