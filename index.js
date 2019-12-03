const http = require('http');
const config = require('./config')
const express = require('express')
const compression = require('compression')
const port = process.env.PORT || 1337;

console.log("Server running at http://localhost:%d", port);


console.log(`${(new Date()).toISOString()} : SAMIDATA PORT IS  ${port}`);

const app = express()

var logger = function (req, res, next) {
    console.log(`${(new Date()).toISOString()} : SAMIDATA REQUEST ${req.url}`);
    next()
};

var check = function (req, res, next) {
    if (!config.useauth) return next()
    if (config.validateKey(req.headers.authorization, req.url)) {
        next();
    } else {
        console.log(`${(new Date()).toISOString()}: Unauthorized request ${req.url} `);
        res.sendStatus(401)
    }
};

app.use(compression({
    threshold: 1024, // sous cette limite les fichiers ne sont pas compressé
    filter: function (req, res) {
        var ct = res.get('content-type');
        // return `true` for content types that you want to compress,
        // `false` otherwise
        return true;
    }
}))

app.use(logger)
let state = 'no error thrown !'
app.use('/', check)
try {
    let request = require('request');
    app.use(config.geourl, function (req, res) {
        const bloburl = `${config.geocont}${req.path}${config.sastoken}`

        console.log(`${(new Date()).toISOString()}: Proxying ${req.url} to ${bloburl}`);
        res.status(200)
        req.pipe(request(bloburl)).pipe(res);
    })
} catch (e) {
    state = `error  thrown !!! <br> ${e.toString()}`
}
app.use('/', (request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end(`Hello World! (node ${process.version})  \n ${state} `);
})


http.createServer(app).listen(port)
console.log(`${(new Date()).toISOString()}: SAMIDATA SERVER running!`);
