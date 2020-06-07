/*
*
* Primary file for the API
*
*/

// Deps
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
const app = {};

// Init function
app.init = () => {
    debugger;
    server.init();
    debugger;
    debugger;

    workers.init();
    debugger;

    // Start the CLI but make it start last!
    debugger;
    setTimeout(() => {
        cli.init()
        debugger;
    }, 50);
    debugger;
    debugger;

    let foo = 1;
    console.log('Just assigned 1 to foo');
    debugger;
    foo++;
    console.log('Just incremented foo');
    debugger;
    foo = foo * foo;
    console.log('Just squared foo');
    debugger;
    foo = foo.toString();
    console.log('Just converted foo to string');
    debugger;

    // call the init script that will throw
    exampleDebuggingProblem.init();
    console.log('Just called the library')
    debugger;
};

app.init();

module.exports = app;