/*
*
*Primary file for the API
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const handlers = {};

handlers.sample = (data, callback) => {
    callback(406, {'name': 'sample handler'})
};

handlers.notFound = (data, callback) => {
    callback(404);
};

const router = {
    'sample': handlers.sample
};

const server = http.createServer((req, res) => {
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedURL.query;
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


});

server.listen(3000, () => console.log('Server is listening on port 3000'));