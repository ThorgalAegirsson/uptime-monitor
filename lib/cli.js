/**
 * CLI-related tasks
 * 
 */

// Deps
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');

class _events extends events { }

const e = new _events();

// Instantiate the CLI module object
const cli = {};

// Input handlers
e.on('man', str => {
    cli.responders.help();
});

e.on('help', str => {
    cli.responders.help();
});

e.on('exit', str => {
    cli.responders.exit();
});

e.on('stats', str => {
    cli.responders.stats();
});

e.on('list users', str => {
    cli.responders.listUsers();
});

e.on('more user info', str => {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', str => {
    cli.responders.listChecks(str);
});

e.on('more check info', str => {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', str => {
    cli.responders.listLogs();
});

e.on('more log info', str => {
    cli.responders.moreLogInfo(str);
});


// Responders object
cli.responders = {};

// Help/Man
cli.responders.help = () => {
    const commands = {
        'exit': 'Kill the CLI (and the rest of the app)',
        'man': 'Show this help page',
        'help': 'Alias of the "man" command',
        'stats': 'Get statistics on the underlying operating system and resource utilization',
        'list users': 'Show a list of all the registered (undeleted) users in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list checks --up --down': 'Show a list of all the active checks in the system, including their state. The "--up" and "--down" flags are both optional',
        'more check info --{checkId}': 'Show details of a specified check',
        'list logs': 'Show a list of all the log files available to be read (compressed only)',
        'more log info --{fileName}': 'Show details of a specified log file'
    };

    // Show a header for the help page that is as wide as the screen
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command, followed by its explanation, in white and yellow, respectivelly
    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            const value = commands[key];
            let line = `\x1b[33m${key}\x1b[0m`;
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    };
    cli.verticalSpace();

    // End with another horizontalLine
    cli.horizontalLine();
};

cli.verticalSpace = height => {
    height = typeof height === 'number' && height > 0 ? height : 1;
    for (let i = 0; i < height; i++) console.log('');
};

cli.horizontalLine = () => {
    // Get the available screen size
    const width = process.stdout.columns;
    let line = '';
    for (let i = 0; i < width; i++) line += '-';
    console.log(line);
};

cli.centered = str => {
    str = typeof str === 'string' && str.trim().length ? str.trim() : '';
    // Get the available screen size
    const width = process.stdout.columns;
    // Calc the left padding there should be
    const leftPadding = Math.floor((width - str.length) / 2);

    let line = '';
    for (let i = 0; i < leftPadding; i++) line += ' ';
    line += str;
    console.log(line);
};

cli.responders.exit = () => {
    process.exit(0);
};

cli.responders.stats = () => {
    // Compile an object of stats
    const stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used(%)': Math.round((v8.getHeapStatistics().used_heap_size/v8.getHeapStatistics().total_heap_size)*100),
        'Available Heap Allocated(%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime': `${os.uptime()} sec`
    };

    // Show a header for the stats page that is as wide as the screen
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each stat, followed by its value, in white and yellow, respectivelly
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            const value = stats[key];
            let line = `\x1b[33m${key}\x1b[0m`;
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    };
    cli.verticalSpace();

    // End with another horizontalLine
    cli.horizontalLine();
};

cli.responders.listUsers = () => {
    _data.list('users', (err, userIds) => {
        if (err || !userIds || !userIds.length) return;
        cli.verticalSpace();
        userIds.forEach(userId => {
            _data.read('users', userId, (err, userData) => {
                if (err || !userData) return;
                let line = `Name: ${userData.firstName} ${userData.lastName} Phone: ${userData.phone} Checks: `;
                const numberOfChecks = typeof userData.checks === 'object' & Array.isArray(userData.checks) && userData.checks.length ? userData.checks.length : 0;
                line += numberOfChecks;
                console.log(line);
                cli.verticalSpace();
            });
        });
    });
};

cli.responders.moreUserInfo = (str) => {
    // Get the ID from the string that was provided
    const arr = str.split('--');
    const userId = typeof arr[1] === 'string' && arr[1].trim().length ? arr[1].trim() : false;
    if (!userId) return;
    // Look up the user
    _data.read('users', userId, (err, userData) => {
        if (err || !userData) return;
        
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(userData, { colors: true });
        cli.verticalSpace();
    });
};

cli.responders.listChecks = (str) => {
    _data.list('checks', (err, checkIds) => {
        if (err || !checkIds || !checkIds.length) return;
        cli.verticalSpace();
        checkIds.forEach(checkId => {
            _data.read('checks', checkId, (err, checkData) => {
                let includeCheck = false;
                const lowerString = str.toLowerCase();

                // Get the state, default to down
                const state = typeof checkData.state === 'string' ? checkData.state : 'down';
                // Get the state, default to unknown
                const stateOrUnknown = typeof checkData.state === 'string' ? checkData.state : 'unknown';
                // If the user has specified the state, or hasn't specified any state, include the current check accordingly
                if (lowerString.includes(`--${state}`) || (!lowerString.includes('--down') && !lowerString.includes('--up'))) {
                    const line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} State: ${stateOrUnknown}`;
                    console.log(line);
                    cli.verticalSpace();
                }
            });
        });
    });
};

cli.responders.moreCheckInfo = (str) => {
    // Get the ID from the string that was provided
    const arr = str.split('--');
    const checkId = typeof arr[1] === 'string' && arr[1].trim().length ? arr[1].trim() : false;
    if (!checkId) return;
    // Look up the check
    _data.read('checks', checkId, (err, checkData) => {
        if (err || !checkData) return;

        // Print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(checkData, { colors: true });
        cli.verticalSpace();
    });
};

cli.responders.listLogs = () => {
    _logs.list(true, (err, logFileNames) => {
        if (err || !logFileNames || !logFileNames.length) return;
        cli.verticalSpace();
        logFileNames.forEach(fileName => {
            if (!fileName.includes('-')) return;
            console.log(fileName);
            cli.verticalSpace();
        });
    });
};

cli.responders.moreLogInfo = str => {
    // Get the fileName from the string that was provided
    const arr = str.split('--');
    const fileName = typeof arr[1] === 'string' && arr[1].trim().length ? arr[1].trim() : false;
    if (!fileName) return;
    cli.verticalSpace();
    // Decompress the log file
    _logs.decompress(fileName, (err, strData) => {
        if (err || !strData) return;
        // Split into lines
        const arr = strData.split('\n');
        arr.forEach(jsonString => {
            const logObject = helpers.parseJsonToObject(jsonString);
            if (logObject && JSON.stringify(logObject) !== '{}') {
                console.dir(logObject, { colors: true });
                cli.verticalSpace();
            }
        });
    });
};

// Input processor
cli.processInput = (str) => {
    str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : false;
    if (!str) return false;

    // Codify the unique strings that identify the unique questions allowed to be asked
    const uniqueInputs = [
        'man',
        'help',
        'exit',
        'stats',
        'list users',
        'more user info',
        'list checks',
        'more check info',
        'list logs',
        'more log info'
    ];

    // Go thru the possible inputs, emit an event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some(input => {
        if (str.toLowerCase().includes(input)) {
            matchFound = true;
            // Emit an event matching the unique input, and include the full string given
            e.emit(input, str);
            return true;
        }
    });

    // If no match is found, tell the user to try again
    if (!matchFound) {
        console.log('Sorry, try again');
    }
};

// define init script
cli.init = () => {
    // Send the start message to the console, in dark blue
    console.log('\x1b[34m%s\x1b[0m', `The CLI is running`);

    // Start the interface
    const _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ':'
    });

    // Create an initial prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on('line', str => {
        // Send the input to a processor
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        _interface.prompt();
    });

    // If the user stops the CLI, kill the associated process
    _interface.on('close', () => {
        process.exit(0);
    });
};

// Export the module
module.exports = cli;