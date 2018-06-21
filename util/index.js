
var superagent = require('superagent');
import tool from './tool';
export function request(opts) {
    return new Promise((resolve, reject) => {
        superagent[opts.type || 'post'](opts.url)
            .set(opts.headers)
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