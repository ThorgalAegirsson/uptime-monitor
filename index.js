/*
*
* Primary file for the API
*
*/

// Deps
const server = require('./lib/server');
const workers = require('./lib/workers');
const helpers = require('./lib/helpers');

helpers.sendTwilioSMS('9172571666', 'testmessage', err => {
    console.error(err)
})


// Declare the app
const app = {};

// Init function
app.init = () => {
    server.init();
    workers.init();
};

app.init();

module.exports = app;