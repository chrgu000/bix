var rest 	 = require('restler'),
    fs   	 = require('fs');
exports.getCode = function(opts){
    return rest.post('http://api.ruokuai.com/create.json', {
        multipart: true,
        data: {
            'username': opts.username,
            'password': opts.password,
            'typeid':'3040',
            'softid': '1',
            'softkey': 'b40ffbee5c1cf4e38028c197eb2fc751',
            'image': rest.file(opts.filename, null,fs.statSync(opts.filename).size, null, 'image/gif') // filename: 抓取回来的码证码文件
        },
        headers: { 
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
            'Content-Type' : 'application/x-www-form-urlencoded' 
        }
    })
}


