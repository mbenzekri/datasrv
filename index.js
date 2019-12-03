const http = require('http');
const config = require('./config')

// const server = http.createServer((request, response) => {
//      console.log(`${(new Date()).toISOString()} : SAMIDATA REQUEST ${request.url}`);
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.end("Hello World!");
// });

const port = process.env.PORT || 1337;
// server.listen(port);

console.log("Server running at http://localhost:%d", port);

const express = require('express')
// var compression = require('compression')

console.log(`${(new Date()).toISOString()} : SAMIDATA PORT IS  ${port}`);

const app = express()

var logger = function (req, res, next) {
    console.log(`${(new Date()).toISOString()} : SAMIDATA REQUEST ${req.url}`);
    next()
};

// var check = function (req, res, next) {
//     if (!config.useauth) return next()
//     if (config.validateKey(req.headers.authorization, req.url)) {
//         next();
//     } else {
//         res.sendStatus(401)
//     }
// };

// app.use(compression({
//     threshold: 1024, // sous cette limite les fichiers ne sont pas compressé
//     filter: function (req, res) {
//         var ct = res.get('content-type');
//         // return `true` for content types that you want to compress,
//         // `false` otherwise
//         return true;
//     }
// }))
app.use(logger)

//app.use('/', check)
// let request = require('request');
// app.use(config.geourl, function (req, res) {
//     const bloburl = `${config.geocont}${req.path}${config.sastoken}`

//     console.log(`${(new Date()).toISOString()}: Proxying ${req.url} to ${bloburl}`);
//     req.pipe(request(bloburl)).pipe(res);
// })

app.use('/', (request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end(`Hello World! (node ${process.version}) `);
})




http.createServer(app).listen(port)
console.log(`${(new Date()).toISOString()}: SAMIDATA SERVER running!`);
