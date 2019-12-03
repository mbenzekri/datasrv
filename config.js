'use strict'

const crypto = require('crypto')
const key = 'qIExyU4FdgAeRDdljDPaelKFc10SlGUF!'.toString('hex').slice(0, 32);
const iv = 'NBHxqEFMWRaEOQ8CZvyWGWUvnsWDciy4'.toString('hex').slice(0, 16);
const prefix = 'STARTSAMIGEODATA';
const suffix = 'ENDSAMIGEODATA';
const conf = {
    useauth: false,
    port: 4000,
    geopath: 'C:\\AMI\\Data\\geo',
    geocont: 'https://samidatastorageaccount.blob.core.windows.net/samidatastoragecontainergeo',
    sastoken : '?sv=2019-02-02&ss=b&srt=co&sp=rwdla&se=2019-12-02T17:48:49Z&st=2019-12-02T09:48:49Z&spr=https&sig=lIaA6Kb7dzJLklQKmf8ENMrxQ9u9I4I220gy1KnHxvQ%3D',
    geourl: '/data/geo',
    docpath: 'C:\\AMI\\Data\\doc',
    docurl: '/data/doc',
    authdelay: 300000, // 5min
    validateKey: function(encrypted,url) {
        if (!encrypted) return false
        const decipher = crypto.createDecipheriv('aes256', key, iv)
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        const array = decrypted.split('|')
        //console.log(JSON.stringify(array))
        if (array.length !== 4 || array[0] !== prefix ||  array[3] !== suffix ) return false;
        const date = parseInt(array[1])
        const now = (new Date()).getTime()
        //console.log(`date now: ${now} date req: ${date}`)
        if (isNaN(date) || (now - date) > conf.authdelay ) return false;
        //console.log(`url exp: ${array[2]} date req: ${url}`)
        return url === array[2]
    },
    produceKey: function(url) {
        const cipher = crypto.createCipheriv('aes256', key, iv)
        const now = (new Date()).getTime()
        let encrypted = cipher.update(`${prefix}|${now}|${url}|${suffix}`, 'utf8','hex')
        encrypted += cipher.final('hex')
        //console.log(`key produced (url: ${url}): ${encrypted} `)
        return encrypted
    }
}

module.exports = conf;

