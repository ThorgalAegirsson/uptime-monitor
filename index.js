/*
*
*Primary file for the API
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

const handlers = {};

handlers.ping = (data, callback) => {
    callback(200);
};

handlers.sample = (data, callback) => {
    callback(200, data);
};

handlers.notFound = (data, callback) => {
    callback(404);
};

const router = {
    ping: handlers.ping,
    sample: handlers.sample
};

const unifiedServer = (req, res) => {
    // const parsedURL = url.parse(req.url, true);
    const parsedURL = new URL(req.url, 'http://localhost');
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedURL.searchParams;
    const headers = req.headers;

    //Get the payload if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();
        // select the handler
        const chosenHandler = router[trimmedPath] || handlers.notFound;

        //construct data object for the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        };

        //Route the request
        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log(`Returning this response: ${statusCode}, ${payloadString}`);
        });
    });
};

const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => console.log(`HTTP server is listening on port ${config.httpPort} in ${config.envName} mode`));

const httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, () => console.log(`HTTPS server is listening on port ${config.httpsPort} in ${config.envName} mode`));