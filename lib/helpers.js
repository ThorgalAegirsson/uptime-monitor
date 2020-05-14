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

module.exports = helpers;