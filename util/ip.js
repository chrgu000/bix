import redis from 'redis';
import random from 'random-useragent';
import { headers } from '../config';
import superagent from 'superagent';
import superagentProxy from 'superagent-proxy';
superagentProxy(superagent)
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
        let ip = 'http://api.66daili.cn/API/GetSecretProxy/?orderid=1750854381801143031&num=20&token=66daili&format=text&line_separator=win&protocol=http&region=domestic';
        return new Promise((resolve, reject) => {
            superagent.get(ip).set(headers).end((error, res) => {
                // console.log(err,res);
                // console.log("getip=>", res.text);
                // let ipList = res.text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g);
                let ips = res.text.split('\r\n')
                ips.splice(ips.length - 1, 1);
                resolve(ips);
                this.gr.hmset('ips', { ips: ips.join(',') });
            })
        })
    }

    getUseLineIp() {
        return new Promise(async (resolve, reject) => {
            var findUseIP = async () => {
                var ips = [];
                var rst = [];
                var ip = !ips.shift() ? (ips = await this.getIps()).shift() : ips.shift();
                console.info('===========testIp:===============');
                console.info('===========testIp:===============');
                console.info('===========testIp:===============');
                console.log("ip=====", ip)
                superagent.get('http://ip.chinaz.com/getip.aspx').set(headers).proxy("http://" + ip).end((err, res) => {
                    console.error("worngIp:", err);
                    if (err) return rst.push(setTimeout(findUseIP, !ips.length ? 10000 : 0))
                    if (res && this.checkip(ip)) {
                        rst.forEach((v) => { clearTimeout(v) })
                        this.setUseIp([ip]);
                        console.warn("ip:", ip)
                        console.warn("ip地址：", res.res.text)
                        resolve({
                            proxy: "http://" + ip,
                            userAgent: random.getRandom()
                        })
                        console.log('清楚队列');
                        console.log("======================endtseti=================")
                        console.log("======================endtseti=================")
                        console.log("======================endtseti=================")
                    } else {
                        rst.push(setTimeout(findUseIP, !ips.length ? 10000 : 0));
                    }

                })
            }
            findUseIP();
        })
    }
    async checkip(ips) {
        let useip = await this.getUseIp();
        let useips = useip.useip;
        var matchIp = (ip) => {
            return useips && useips.split(',').indexOf(ip) !== -1 ? false : ip;
        }
        return matchIp(ips);
    }
}