const http = require('http');
const config = require('./config')
const express = require('express')
const compression = require('compression')
const port = process.env.PORT || 1337;

console.log(`==========> ${(new Date()).toISOString()} : SAMIDATA STARTING ON PORT ${port}`);

const app = express()

function logger (req, res, next) {
    console.log(`${(new Date()).toISOString()} : SAMIDATA REQUEST ${req.url}`);
    next()
}

var check = function (req, res, next) {
    if (!config.useauth) return next()
    if (config.validateKey(req.headers['X-sami-token'], req.url)) {
        console.log(`==========> ${(new Date()).toISOString()}: SAMIDATA Authorized request  ${req.headers['X-sami-token']} for ${req.url} `);
        next();
    } else {
        console.log(`==========> ${(new Date()).toISOString()}: SAMIDATA Unauthorized request ${req.url} `);
        res.sendStatus(401)
    }
}

app.use(compression())

app.use(logger)
let state = 'no error thrown !'
app.use('/geo', check)
let request = require('request');
app.use('/geo', function (req, res) {
    const bloburl = `${config.geocont}${req.path}${config.sastoken}`

    console.log(`==========> ${(new Date()).toISOString()}: SAMIDATA Proxying ${req.url} to ${bloburl}`);
    res.status(200)
    req.pipe(request(bloburl)).pipe(res);
})



http.createServer(app).listen(port)
console.log(`==========>  ${(new Date()).toISOString()}: SAMIDATA SERVER running!`);
