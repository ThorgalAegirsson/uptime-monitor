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
app.init = callback => {
    server.init();
    workers.init();
    // Start the CLI but make it start last!
    setTimeout(() => {
        cli.init();
        callback();
    }, 50);

};

// Self invoking only if required directly - in the test suite it is not invoked, but from CLI (node index) it is
if (require.main===module) app.init(()=>{});

module.exports = app;