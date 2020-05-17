/*
*
* Helpers 
*
*/

const crypto = require('crypto');
const config = require('../config');
const querystring = require('querystring');
const https = require('https');

const helpers = {};

// Create a SHA-256 hash
helpers.hash = str => {
    if (typeof (str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', config.hashSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

helpers.parseJsonToObject = str => {
    try {
        return JSON.parse(str);
    } catch (error) {
        return {};
    }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = strLength => {
    strLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (!strLength) return false;
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 1; i <= strLength; i++) {
        const randomChar = possibleChars.charAt(Math.random() * possibleChars.length);
        str += randomChar;
    }
    return str;
}

// Send an SMS message via Twilio
helpers.sendTwilioSMS = (phone, msg, callback) => {
    // Validate parameters
    phone = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    msg = typeof msg === 'string' && msg.trim().length <= 1600 ? msg.trim() : false;
    if (!phone || !msg) return callback('Given parameters were missing or invalid');
    // Configure the request payload
    const payload = {
        From: config.twilio.fromPhone,
        To: `+1${phone}`,
        Body: msg
    };
    //Stringify the payload
    const payloadString = querystring.stringify(payload);
    
    // Configure the request details
    const requestDetails = {
        protocol: 'https:',
        hostname: 'api.twilio.com',
        method: 'POST',
        path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
        auth: `${config.twilio.accountSid}:${config.twilio.authToken}`,
        headers: {
            'Content-Type': 'aplication/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(payloadString)
        }
    };

    // Instantiate the request object
    const req = https.request(requestDetails, res => {
        // Grab the status of the sent request
        const status = res.statusCode;
        // Callback successfully if the request went through
        if (status === 200 || status === 201) {
            callback(null);
        } else {
            // console.error(res)
            callback(`Status code returned was ${status}.`);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', err => {
        console.error(err)
        callback(err);
    });

    // Add the payload to the request
    req.write(payloadString);

    // End the request (it sends the request)
    req.end();
}

module.exports = helpers;