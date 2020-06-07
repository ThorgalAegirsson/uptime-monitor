/*
*
* Helpers 
*
*/

const crypto = require('crypto');
const config = require('../config');
const querystring = require('querystring');
const https = require('https');
const path = require('path');
const fs = require('fs');

const helpers = {};

// Sample for testing that simply returns a number
helpers.getANumber = () => 1;

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
};

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
            'Content-Type': 'application/x-www-form-urlencoded',
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
};

// Get the string content of a template
helpers.getTemplate = (templateName, data, callback) => {
    templateName = typeof templateName === 'string' && templateName.length > 0 ? templateName : false;
    data = typeof data === 'object' && data != null ? data : {};

    if (!templateName) return callback('A valid template name was not specified');
    const templatesDir = path.join(__dirname, '/../templates/');
    fs.readFile(`${templatesDir}${templateName}.html`, 'utf8', (err, str) => {
        if (err || !str || str.length === 0) return callback('No template found');
        callback(null, helpers.interpolate(str, data));
    });
};

// Add the universal header and footer to a string and pass provided data object to them for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
    str = typeof str === 'string' && str.length > 0 ? str : '';
    data = typeof data === 'object' && data != null ? data : {};
    helpers.getTemplate('_header', data, (err, headerString) => {
        if (err || !headerString) return callback('Couldn\'t find the header template');
        helpers.getTemplate('_footer', data, (err, footerString) => {
            if (err || !footerString) return callback('Couldn\'t find the footer template');
            const fullString = headerString + str + footerString;
            callback(null, fullString);
        });
    });
};

// Take a given string and a data object and find/replace all the keys within the string
helpers.interpolate = (str, data) => {
    str = typeof str === 'string' && str.length > 0 ? str : '';
    data = typeof data === 'object' && data != null ? data : {};

    // Add the template globals to the data object, prepending their key names with global
    for (let keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data[`global.${keyName}`] = config.templateGlobals[keyName];
        }
    }

    // For each key in the data object, insert its value into the string at the corresponding placeholder
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof data[key] === 'string') {
            str = str.replace(`{${key}}`, data[key]);
        }
    }

    return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback) => {
    fileName = typeof fileName === 'string' && fileName.length > 0 ? fileName : false;
    if (!fileName) return callback('A valid file name was not specified');
    const publicDir = path.join(__dirname, '/../public/');
    fs.readFile(`${publicDir}${fileName}`, (err, data) => {
        if (err || !data) return callback('File couldn\'t be found');
        callback(null, data);
    });
};

module.exports = helpers;