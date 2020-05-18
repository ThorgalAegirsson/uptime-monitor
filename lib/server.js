/*
*
* Server logic
*
* 
*/


// Dependencies
const http = require('http');
const https = require('https');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const path = require('path');
const util = require('util');
const config = require('../config');
const handlers = require('./handlers');
const helpers = require('./helpers');


const debug = util.debuglog('server');


// Instantiate the server module object
const server = {};

// Create a req router
server.router = {
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks
};

server.unifiedServer = (req, res) => {
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
        const chosenHandler = server.router[trimmedPath] || handlers.notFound;

        //construct data object for the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: helpers.parseJsonToObject(buffer)
        };
        debug('>>>> SERVER >>> data:')
        debug(data)
        //Route the request
        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // If the response is 200, print green, otherwise print red
            if (statusCode === 200) {
                debug('\x1b[32m%s\x1b[0m',`${method.toUpperCase()}/${trimmedPath} ${statusCode}`);
            } else {
                debug('\x1b[31m%s\x1b[0m',`${method.toUpperCase()}/${trimmedPath} ${statusCode}`);
            }
        });
    });
};

server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});




// Init the server
server.init = () => {
    // Start HTTP server
    
    server.httpServer.listen(config.httpPort, () => console.log('\x1b[36m%s\x1b[0m', `HTTP server is listening on port ${config.httpPort} in ${config.envName} mode`));
    
    // Start HTTPS server
    server.httpsServer.listen(config.httpsPort, () => console.log('\x1b[35m%s\x1b[0m', `HTTPS server is listening on port ${config.httpsPort} in ${config.envName} mode`));
}


module.exports = server;