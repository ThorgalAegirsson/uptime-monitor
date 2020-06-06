/*
*
* Primary file for the API
*
*/

// Deps
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

// Declare the app
const app = {};

// Init function
app.init = () => {
    server.init();
    workers.init();
    // Start the CLI but make it start last!
    setTimeout(() => cli.init(), 50);
};

app.init();

module.exports = app;