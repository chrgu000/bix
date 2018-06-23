import redis from 'redis';
import random from 'random-useragent';
import { headers } from '../config';
import superagent from 'superagent';
export default class ip {
    constructor() {
        this.gr = this.getRedis()();
    }
    getRedis() {
        var result;
        let client = redis.createClient('6379', '127.0.0.1');
        client.on('ready', (err) => {
            console.log("redis-error:", err);
        });
        return function () { return result || (result = client) };
    }
    setUseIp(ip) {
        return new Promise((resolve, reject) => {
            this.gr.hgetall('useIp', (err, obj) => {
                var lineip = obj ? obj.useip.split(',').concat(ip) : ip;
                this.gr.del('useIp', (err, reply) => {
                    if (err) return resolve({ type: false });
                    this.gr.hmset('useIp', { useip: lineip.join(',') })
                    resolve({ type: true })
                })
            })
        })
    }

    getUseIp() {
        return new Promise((resolve, reject) => {
            this.gr.hgetall('useIp', (err, obj) => {
                if (err) return resolve({ type: false })
                resolve({ type: true, useip: obj.useip })
            })
        })
    }

    getIps() {
        let ip = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1';
        return new Promise((resolve, reject) => {
            this.gr.hgetall('ips', (err, obj) => {
                // console.log("ips", obj);
                if (!obj) {
                    superagent.get(ip).set(headers).end((error, res) => {
                        let ipList = res.text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g);
                        resolve(ipList);
                        this.gr.hmset('ips', { ips: ipList.join(',') });
                    })
                } else {
                    resolve(obj);
                }
            });

        })
    }
    getUseLineIp() {
        return new Promise(async (resolve, reject) => {
            let ips = await this.getIps();
            let lp = await this.checkip(ips);
            let rs = await this.refreshIP('ips', lp.ips);
            rs && await this.setUseIp([ips]);
            console.log("ipipipip=",lp.lineIp);
            resolve({
                proxy: "http://"+lp.lineIp,
                userAgent: random.getRandom()
            })
        })
    }

    async checkip(ips) {
        let ipsArr = ips.ips.split(',');
        let useip = await this.getUseIp();
        let useips = useip.useip;
        var matchIp = (ip) => {
            return useips && useips.split(',').indexOf(ip) !== -1 ? matchIp(ipsArr.shift()) : ip;
        }
        return { lineIp: matchIp(ipsArr.shift()), ips: ipsArr };
    }
    refreshIP(key, rval) {
        let obj = {};
        return new Promise((resolve, reject) => {
            this.gr.del(key, (err, reply) => {
                if (err) return resolve({ type: false })
                obj[key] = rval.join(',')
                this.gr.hmset(key, obj);
                resolve({ type: true })
            })
        })
    }
}