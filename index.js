const express = require('express')
const cors = require('cors')
const config = require('./config')
const https = require('https')
const http = require('http')
const fs = require('fs')
const cluster = require('cluster')
var compression = require('compression')
request = require('request');

var workercount = 2*require('os').cpus().length;
const port = process.env.PORT || config.port || 4000
if (cluster.isMaster) {

    console.log("--------------------------------------------------------------------------------");
    console.log("-- SAMI Data Serveur ");
    console.log(`-- Geo data : https://<domain>:${port}${config.geourl} ==> ${config.geopath}`);
    console.log(`-- Doc data : https://<domain>:${port}${config.docurl} ==> ${config.docpath}`);
    console.log("--------------------------------------------------------------------------------");

    // Fork workers.
    for (var i = 0; i < workercount; i++) {
        cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
        console.log(`SAMI Data: worker[${worker.process.pid}] died`);
    });

} else {
    const app = express()

    var logger = function (req, res, next) {
        console.log(`${(new Date()).toISOString()}: worker[${cluster.worker.id}] serving ${req.url}`)
        next()
    };

    var check = function (req, res, next) {
        if (!config.useauth) return next()
        if (config.validateKey(req.headers.authorization, req.url)) {
            next();
        } else {
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
    app.use(cors())
    app.use(logger)
    app.use('/', check)
    app.use(config.geourl,function(req, res){
        const bloburl = `${config.geocont}${req.path}${config.sastoken}`
        
        console.log(`${(new Date()).toISOString()} worker[${cluster.worker.id}]: Proxying ${req.url} to ${bloburl}`);
        req.pipe(request(bloburl)).pipe(res);
    })
    //app.use(config.docurl, express.static(config.docpath));
    console.log(`${(new Date()).toISOString()}: worker[${cluster.worker.id}] running!`);

    // https.createServer({
    //     key: fs.readFileSync('server.key'),
    //     cert: fs.readFileSync('server.cert')
    // }, app).listen(port);

    http.createServer(app).listen(port)
}
