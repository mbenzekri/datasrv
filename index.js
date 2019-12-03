const http = require('http');

const server = http.createServer((request, response) => {
     console.log(`${(new Date()).toISOString()} : SAMIDATA REQUEST ${request.url}`);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World!");
});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);

// const express = require('express')
// const cors = require('cors')
// const config = require('./config')
// const https = require('https')
// const http = require('http')
// const fs = require('fs')
// const cluster = require('cluster')
// var compression = require('compression')
// request = require('request');

// var workercount = 2 * require('os').cpus().length;
// const port = process.env.PORT || config.port
// console.log(`================> PORT IS : ${port}`)

// const app = express()

// var logger = function (req, res, next) {
//     console.log(`${(new Date()).toISOString()}: serving ${req.url}`)
//     next()
// };

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
// app.use(cors())
// app.use(logger)
// app.use('/', check)
// app.use(config.geourl, function (req, res) {
//     const bloburl = `${config.geocont}${req.path}${config.sastoken}`

//     console.log(`${(new Date()).toISOString()}: Proxying ${req.url} to ${bloburl}`);
//     req.pipe(request(bloburl)).pipe(res);
// })
// //app.use(config.docurl, express.static(config.docpath));
// console.log(`${(new Date()).toISOString()}: server running!`);

// // https.createServer({
// //     key: fs.readFileSync('server.key'),
// //     cert: fs.readFileSync('server.cert')
// // }, app).listen(port);

// http.createServer(app).listen(port)
