import superagent from "superagent";
import cheerio from "cheerio";
import { headers } from '../config';


export function identity() {
    return new Promise((resolve, rejects) => {
        var identityObj = [];
        superagent
            .get('http://id.chacha138.com/')
            .set(headers)
            .end((err, res) => {
                var $ = cheerio.load(res.text);
                var $l3 = $('.l3');
                $l3.map((v, v2) => {
                    var $li = $(v2).find('li')
                    $li.map((v, v2) => {
                        identityObj.push($(v2).text().split('  ').join(','))
                    })
                })
                resolve(identityObj)
            })
    })
}