/*
*
* Helpers 
*
*/

const crypto = require('crypto');
const config = require('../config');


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

module.exports = helpers;