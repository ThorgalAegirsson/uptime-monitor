/*
* Worker tasks
*
*/

const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const util = require('util');
const _data = require('./data');
const helpers = require('./helpers');
const _logs = require('./logs');

const debug = util.debuglog('workers');

// Instantiate the worker object
const workers = {};

// Create a log entry
workers.log = (checkData, checkOutcome, state, alertWarranted, timeOfCheck) => {
    // Form the log data
    const logData = {
        check: checkData,
        outcome: checkOutcome,
        state,
        alert: alertWarranted,
        time: timeOfCheck
    };

    // Convert to a string
    const logString = JSON.stringify(logData);

    // Determine the name of the log file
    const logFileName = checkData.id;

    // Append the log entry to the file
    _logs.append(logFileName, logString, err => {
        if (err) return console.error('Logging to file failed');
        debug('Logging to file succeded');
    });
};


// Alert the user as to a change in their check status
workers.alertUserToStatusChange = newCheckData => {
    const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
    helpers.sendTwilioSMS(newCheckData.userPhone, msg, err => {
        debug(newCheckData)
        if (err) return console.error('Error: Could not send SMS alert to user who had a state change in their check', err);
        debug('Success: User was alerted to a status change in their check via sms: ', msg);
    })
};
// Process the check outcome and update the check data as needed and trigger an alert if needed
// Special logic for accomodating a check that has never been tested before - change happens from default 'down' to 'up' (don't alert on that one)
workers.processCheckOutcome = (checkData, checkOutcome) => {
    // Decide if the check is considered up or down
    const state = !checkOutcome.error && checkOutcome.responseCode && checkData.successCodes.includes(checkOutcome.responseCode) ? 'up' : 'down';

    // Is an alert warranted? Is it the change from default 'down'?
    const alertWarranted = checkData.lastChecked && checkData.state !== state;
    
    // Log the outcome
    const timeOfCheck = Date.now();
    workers.log(checkData, checkOutcome, state, alertWarranted, timeOfCheck);

    // UPdate the check data
    const newCheckData = checkData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;


    // Save the update
    _data.update('checks', newCheckData.id, newCheckData, err => {
        if (err) return debug('Error saving updates to check: ', newCheckData.id);
        debug('check completed and saved')
        // Send the new check data to the next phase in the process if needed
        if (alertWarranted) workers.alertUserToStatusChange(newCheckData);
    });
};

// Perform the check, send the originCheckData and the outcome of the check to the next step of the process
workers.performCheck = checkData => {
    // Prepare the initial check outcome
    const checkOutcome = {
        error: false,
        responseCode: false
    };
    // Mark that the outcome has not been sent yet
    let outcomeSent = false;

    // Parse the hostname and the path out of the original check data
    const parsedUrl = new URL(`${checkData.protocol}://${checkData.url}`);
    const hostname = parsedUrl.hostname;
    const path = `${parsedUrl.pathname}${parsedUrl.search}`;

    // Construct the request
    const requestDetails = {
        protocol: `${checkData.protocol}:`,
        hostname,
        path,
        method: checkData.method.toUpperCase(),
        timeout: checkData.timeoutSeconds * 1000
    };
    // Instantiate the request object 
    const _moduleToUse = checkData.protocol === 'http' ? http : https;
    const req = _moduleToUse.request(requestDetails, res => {
        // Grab the status of the sent request
        const status = res.statusCode;
        // Update the checkOutcome and pass the data along
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', err => {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {
            error: true,
            value: err
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Bind to the timeout event
    req.on('timeout', err => {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {
            error: true,
            value: 'timeout'
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Send the request
    req.end();
};

// Sanity-check the checkData
workers.validate = checkData => {
    checkData = typeof checkData === 'object' && checkData !== null ? checkData : {};
    checkData.id = typeof (checkData.id) === 'string' && checkData.id.trim().length === 20 ? checkData.id.trim() : false;
    checkData.userPhone = typeof (checkData.userPhone) === 'string' && checkData.userPhone.trim().length === 10 ? checkData.userPhone.trim() : false;
    checkData.protocol = typeof (checkData.protocol) === 'string' && ['http', 'https'].includes(checkData.protocol) ? checkData.protocol : false;
    checkData.method = typeof (checkData.method) === 'string' && ['get', 'post', 'put', 'delete'].includes(checkData.method) ? checkData.method : false;
    checkData.successCodes = typeof (checkData.successCodes) === 'object' && checkData.successCodes instanceof Array && checkData.successCodes.length ? checkData.successCodes : false;
    checkData.url = typeof (checkData.url) === 'string' && checkData.url.trim().length ? checkData.url.trim() : false;
    checkData.timeoutSeconds = typeof (checkData.timeoutSeconds) === 'number' && checkData.timeoutSeconds % 1 === 0 && checkData.timeoutSeconds >= 1 && checkData.timeoutSeconds <= 5 ? checkData.timeoutSeconds : false;

    // Set the keys that may not be set (if the workers have never seen this check before)
    checkData.state = typeof (checkData.state) === 'string' && ['up', 'down'].includes(checkData.state) ? checkData.state : 'down';
    checkData.lastChecked = typeof (checkData.lastChecked) === 'number' && checkData.lastChecked > 0 ? checkData.lastChecked : false;

    // pass the data along to the next step in the process
    if (checkData.id &&
        checkData.userPhone &&
        checkData.protocol &&
        checkData.method &&
        checkData.successCodes &&
        checkData.url &&
        checkData.timeoutSeconds) {
        workers.performCheck(checkData);
    } else {
        console.error('Error: ONe of the checks is not properly formatted');
    };
};

// Look up all the checks, gather the data and send it to a validator
workers.gatherAllChecks = () => {
    // Get all the checks
    _data.list('checks', (err, checks) => {
        if (err || !checks || checks.length === 0) return console.error('Error: Could not find any checks to process');
        checks.forEach(check => {
            // Read the check data
            _data.read('checks', check, (err, checkData) => {
                if (err || !checkData) return console.error('Error: could not read the check: ', check);
                // Pass the data to the check validator, and let that function continue or log an error as needed
                workers.validate(checkData);
            });
        });
    });
};

// Timer to execute the worker process once per minute
workers.loop = () => {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 1000 * 60);
};

// Rotate (compress) the log files
workers.rotateLogs = () => {
    // List all the non-compressed log files
    _logs.list(false, (err, logs) => {
        if (err || !logs || !logs.length) return console.error('Error: Could not find any logs to rotate');
        logs.forEach(logName => {
            // Compress the data to a different file
            const newFileId = `${logName.replace('.log', '')}-${Date.now()}`;
            _logs.compress(logName, newFileId, err => {
                if (err) return console.error('Error compressing one of the log files, ', err);
                // Truncate the log
                _logs.truncate(logName, err => {
                    if (err) return console.error('Error truncating log file', err);
                    debug('SUccess truncating file')
                });
            });
        });
    })
};

// Timer to execute log rotation process once per day
workers.logRotationLoop = () => {
    setInterval(() => {
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24);
};

// Initialize workers
workers.init = () => {

    // Send to console in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers started');
    // Execute all the checks immediately
    workers.gatherAllChecks();
    // Call the loop so the checks are continued
    workers.loop();
    // Compress all the logs immediately
    workers.rotateLogs();
    // Run the compression loop
    workers.logRotationLoop();
}

module.exports = workers;