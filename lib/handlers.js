/* 
*
* Request handlers
*
*/

const _data = require('./data');
const helpers = require('./helpers');
const config = require('../config');
const handlers = {};

/**
 *  HTML Handlers
 * 
 */


// Index handler
handlers.index = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');
    
    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Uptime Monitoring - Made Simple',
        'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down we\'ll send you a text to let you know',
        'body.class': 'index'
    };
    
    // Read in a template as a string
    helpers.getTemplate('index', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Create Account
handlers.accountCreate = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');

    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Create an account',
        'head.description': 'Sign up is easy and only takes a few seconds.',
        'body.class': 'accountCreate'
    };

    // Read in a template as a string
    helpers.getTemplate('accountCreate', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Create Session
handlers.sessionCreate = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');

    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Log into your account',
        'head.description': 'Please enter your phone number and password to access your account',
        'body.class': 'sessionCreate'
    };

    // Read in a template as a string
    helpers.getTemplate('sessionCreate', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Delete Session
handlers.sessionDeleted = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');

    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Logged out',
        'head.description': 'You have been logged out of your account',
        'body.class': 'sessionDeleted'
    };

    // Read in a template as a string
    helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Edit Account
handlers.accountEdit = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');

    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Account Settings',
        'body.class': 'accountEdit'
    };

    // Read in a template as a string
    helpers.getTemplate('accountEdit', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Delete Account
handlers.accountDeleted = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');

    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Account Deleted',
        'head.description': 'Your account has been deleted',
        'body.class': 'accountDeleted'
    };

    // Read in a template as a string
    helpers.getTemplate('accountDeleted', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Create checks
handlers.checksCreate = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');

    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Create a new check',
        'body.class': 'checksCreate'
    };

    // Read in a template as a string
    helpers.getTemplate('checksCreate', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Dashboard (view all checks)
handlers.checksList = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');

    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Dashboard',
        'body.class': 'checksList'
    };

    // Read in a template as a string
    helpers.getTemplate('checksList', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Edit checks
handlers.checksEdit = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');

    // Prepare data for interpolation
    const templateData = {
        'head.title': 'Check Details',
        'body.class': 'checksEdit'
    };

    // Read in a template as a string
    helpers.getTemplate('checksEdit', templateData, (err, str) => {
        if (err || !str) return callback(500, undefined, 'html');
        helpers.addUniversalTemplates(str, templateData, (err, page) => {
            if (err || !str) return callback(500, undefined, 'html');
            callback(200, page, 'html');
        });
    });
};

// Favicon handler
handlers.favicon = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', (err, data) => {
        if (err || !data) return callback(500);
        callback(200, data, 'favicon');
    });
};

// Public assets
handlers.public = (data, callback) => {
    if (data.method !== 'get') return callback(405, undefined, 'html');
    // Get the filename requested
    const assetName = data.trimmedPath.replace('public/', '').trim();

    if (assetName.length === 0) return callback(404);

    helpers.getStaticAsset(assetName, (err, data) => {
        if (err || !data) return callback(500);
        // Determine the content type (default to plain text)
        let contentType = 'plain';
        if (assetName.includes('.css')) contentType = 'css';
        if (assetName.includes('.png')) contentType = 'png';
        if (assetName.includes('.jpg')) contentType = 'jpg';
        if (assetName.includes('.ico')) contentType = 'favicon';
        callback(200, data, contentType);
    });
};




/**
 *  JSON API Handlers
 * 
 */


// Example error
handlers.exampleError = (data, callback) => {
    const err = new Error('This is an example error');
    throw (err);
};

// USERS

handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (!acceptableMethods.includes(data.method)) return callback(405);
    handlers._users[data.method](data, callback);
};

handlers._users = {};

// Users - post
// Required fields: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
    // Check if all req data is provided
    const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 10 ? data.payload.password.trim() : false;
    const tosAgreement = typeof (data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true;
    if (firstName && lastName && phone && password && tosAgreement) {
        // Check if the user already exists
        _data.read('users', phone, (err, data) => {
            if (!err) return callback(400, { Error: 'A user with that phone number already exists' });
            // Hash the password
            const hashedPassword = helpers.hash(password);
            if (!hashedPassword) return callback(500, { Error: 'Could not hash the user\'s password. Aborting...' });
            // Create a user object
            const userObject = {
                firstName,
                lastName,
                phone,
                hashedPassword,
                tosAgreement: true
            };

            // Store the user
            _data.create('users', phone, userObject, err => {
                if (err) {
                    console.log(err);
                    return callback(500, { Error: 'Could not create the user' });
                }
                callback(200);
            });
        });
    } else {
        callback(400, { Error: 'Missing required fields' });
    }
};

// Users - get
// Required fields: phone
// Optional data: none
handlers._users.get = (data, callback) => {
    const phone = data.queryStringObject.get('phone');
    const phoneNumber = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    if (phoneNumber) {
        // Only let the authenticated users access their object

        // Get the token from the headers
        const token = typeof data.headers.token === 'string' ? data.headers.token : false;
        console.log(token)

        // Verify the token is valid for the phone number
        handlers._tokens.verifyToken(token, phoneNumber, tokenIsValid => {
            if (!tokenIsValid) return callback(403, { Error: 'Missing required token or the token is not valid' });

            // Look up the user
            _data.read('users', phoneNumber, (err, userData) => {
                if (err || !userData) return callback(404);
                // Removed the hashed password from the user object
                delete userData.hashedPassword;
                callback(200, userData);
            })
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Users - put
// Required fields: phone
// Optional data: firstName, lastName, password (at least one of those must be specified)
handlers._users.put = (data, callback) => {
    const phone = data.payload.phone;
    const phoneNumber = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    if (phoneNumber) {


        const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
        const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 10 ? data.payload.password.trim() : false;
        if (firstName || lastName || password) {
            // Only let the authenticated users access their object
            // Get the token from the headers
            const token = typeof data.headers.token === 'string' ? data.headers.token : false;

            // Verify the token is valid for the phone number
            handlers._tokens.verifyToken(token, phoneNumber, tokenIsValid => {
                if (!tokenIsValid) return callback(403, { Error: 'Missing required token or the token is not valid' });
                // Look up the user
                _data.read('users', phoneNumber, (err, userData) => {
                    if (err || !userData) return callback(404, { Error: 'This user does not exist' });
                    // update fields
                    if (firstName) userData.firstName = firstName;
                    if (lastName) userData.lastName = lastName;
                    if (password) userData.hashedPassword = helpers.hash(password);
                    // save to a file
                    _data.update('users', phoneNumber, userData, (err) => {
                        if (err) {
                            console.error(err);
                            callback(500, { Error: 'Could not update the user' });
                        } else {
                            callback(200);
                        }
                    });
                });
            });
        } else {
            callback(400, { Error: 'Nothing to update' });
        }
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Users - delete
// Required fields: phone
// Optional data: none
handlers._users.delete = (data, callback) => {
    const phone = data.queryStringObject.get('phone');
    const phoneNumber = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    if (phoneNumber) {
        // Only let the authenticated users access their object
        // Get the token from the headers
        const token = typeof data.headers.token === 'string' ? data.headers.token : false;

        // Verify the token is valid for the phone number
        handlers._tokens.verifyToken(token, phoneNumber, tokenIsValid => {
            if (!tokenIsValid) return callback(403, { Error: 'Missing required token or the token is not valid' });
            _data.read('users', phoneNumber, (err, userData) => {
                if (err) return callback(404, { Error: 'Could not find the user' });
                _data.delete('users', phoneNumber, err => {
                    if (err) return callback(500, { Error: 'Could not delete the user' })
                    console.log('>>> DELETING...')
                    // delete all the checks from the user
                    const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];
                    console.log('user checks: ', userChecks);
                    const userChecksLength = userChecks.length;
                    if (userChecksLength) {

                        let checksDeleted = 0;
                        let deletionErrors = 0;
                        userChecks.forEach(checkId => {
                            _data.delete('checks', checkId, err => {
                                if (err) deletionErrors++;
                                checksDeleted++;
                                if (checksDeleted === userChecksLength) {
                                    if (deletionErrors) return callback(500, { Error: `Errors encountered during removing the checks. ${deletionErrors} of the checks might have remained in the system` });
                                    callback(200);
                                }
                            });
                        });
                    } else {
                        callback(200);
                    }
                });
            });
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// TOKENS

handlers.tokens = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (!acceptableMethods.includes(data.method)) return callback(405);
    handlers._tokens[data.method](data, callback);
};

handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = (data, callback) => {
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 10 ? data.payload.password.trim() : false;
    console.log('phone, password: ', phone, password)
    if (phone && password) {
        // Look up the user with the phone number
        _data.read('users', phone, (err, userData) => {
            console.log(userData)
            if (err || !userData) return callback(400, { Error: 'Could not specified user' });
            // compare hashed sent password with the stored hashed password
            const hashedPassword = helpers.hash(password);
            console.log(hashedPassword, userData.hashedPassword)
            if (hashedPassword === userData.hashedPassword) {
                //create a token with the expiration date 1 hr
                const tokenId = helpers.createRandomString(20);
                const expires = Date.now() + 1000 * 60 * 60;
                const tokenObject = {
                    phone,
                    expires,
                    id: tokenId
                };

                // Store the token
                _data.create('tokens', tokenId, tokenObject, err => {
                    if (err) return callback(500, { Error: 'Could not create a new token' });
                    callback(200, tokenObject);
                });
            } else {
                callback(400, { Error: 'Wrong password' });
            }
        });
    } else {
        callback(400, { Error: 'Missing required fields' });
    }
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = (data, callback) => {
    // Check the id is valid
    const idQuery = data.queryStringObject.get('id');
    const id = typeof idQuery === 'string' && idQuery.trim().length === 20 ? idQuery.trim() : false;
    if (id) {
        _data.read('tokens', id, (err, tokenData) => {
            if (err || !tokenData) return callback(404);
            callback(200, tokenData);
        })
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Tokens - put
// Required: id, extend
// Optional: none
handlers._tokens.put = (data, callback) => {
    const id = typeof (data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
    const extend = typeof (data.payload.extend) === 'boolean' && data.payload.extend === true;
    if (id && extend) {
        // Look up the token
        _data.read('tokens', id, (err, tokenData) => {
            if (err || !tokenData) return callback(400, { Error: 'Token does not exist' });
            // Make sure the token is not expired
            if (tokenData.expires < Date.now()) return callback(400, { Error: 'The token has already expired and cannot be extended' });
            // Set the expiration an hour from now
            tokenData.expires = Date.now() + 1000 * 60 * 60;
            // Store the new token
            _data.update('tokens', id, tokenData, err => {
                if (err) return callback(500, { Error: 'Could not update the token\'s expiration date' });
                callback(200);
            })
        })
    } else {
        callback(400, { Error: 'Missing required fields or fields are invalid' });
    }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = (data, callback) => {
    const idQuery = data.queryStringObject.get('id');
    const id = typeof idQuery === 'string' && idQuery.trim().length === 20 ? idQuery.trim() : false;
    if (id) {
        _data.read('tokens', id, (err, userData) => {
            if (err) return callback(404, { Error: 'Could not find the token' });
            _data.delete('tokens', id, err => {
                if (err) return callback(500, { Error: 'Could not delete the token' })
                callback(200);
            });
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Verify if a given token id is valid for a given user
handlers._tokens.verifyToken = (id, phone, callback) => {
    // Look up the token
    _data.read('tokens', id, (err, tokenData) => {
        if (err || !tokenData) return callback(false);
        // Check the token is for the user and has not expired
        if (tokenData.phone === phone && tokenData.expires > Date.now()) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

// CHECKS

handlers.checks = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (!acceptableMethods.includes(data.method)) return callback(405);
    handlers._checks[data.method](data, callback);
};

handlers._checks = {};

// Checks - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.post = (data, callback) => {
    const protocol = typeof data.payload.protocol === 'string' && ['https', 'http'].includes(data.payload.protocol) ? data.payload.protocol : false;
    const method = typeof data.payload.method === 'string' && ['post', 'get', 'put', 'delete'].includes(data.payload.method) ? data.payload.method : false;
    const url = typeof data.payload.url === 'string' && data.payload.url.length > 0 ? data.payload.url : false;
    const successCodes = typeof data.payload.successCodes === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof data.payload.timeoutSeconds === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get the token from the headers
        const token = typeof data.headers.token === 'string' ? data.headers.token : false;

        // Look up the user by reading the token
        _data.read('tokens', token, (err, tokenData) => {
            if (err || tokenData.expires < Date.now()) return callback(403);
            const userPhone = tokenData.phone;
            //Look up the user
            _data.read('users', userPhone, (err, userData) => {
                if (err || !userData) callback(403);
                const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];
                // Verify the user has less than max number of checks
                if (userChecks.length < config.maxChecks) {
                    // Create a random id for the check
                    const checkId = helpers.createRandomString(20);
                    // Create the check object with the phone
                    const checkObject = {
                        id: checkId,
                        userPhone,
                        protocol,
                        url,
                        method,
                        successCodes,
                        timeoutSeconds
                    };
                    _data.create('checks', checkId, checkObject, err => {
                        if (err) return callback(500, { Error: 'Could not create the new check' });
                        // Add the checkId to the user object
                        userData.checks = userChecks;
                        userData.checks.push(checkId);
                        _data.update('users', userPhone, userData, err => {
                            if (err) return callback(500, { Error: 'Could not update the user with the new check' });
                            callback(200, checkObject);
                        });
                    });
                } else {
                    callback(400, { Error: `The user already has the maximum number of checks (${config.maxChecks})` });
                }
            })
        });


    } else {
        callback(400, { Error: 'Missing required inputs or inputs are invalid' });
    }
};

// Checks - get
// Required: id
// Optional: none
handlers._checks.get = (data, callback) => {
    const idQuery = data.queryStringObject.get('id');
    const id = typeof idQuery === 'string' && idQuery.trim().length === 20 ? idQuery.trim() : false;
    if (id) {
        // Look up the check
        _data.read('checks', id, (err, checkData) => {
            if (err || !checkData) return callback(404);
            // Only let the authenticated users access their object

            // Get the token from the headers
            const token = typeof data.headers.token === 'string' ? data.headers.token : false;

            // Verify the token is valid and belongs to the user
            handlers._tokens.verifyToken(token, checkData.userPhone, tokenIsValid => {
                if (!tokenIsValid) return callback(403, { Error: 'Missing required token or the token is not valid' });

                // Return the check data
                callback(200, checkData);
            });
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Checks - put
// Required: id
// Optional: protocol, url, method, successCodes, timeoutSeconds (at least must be specified)
handlers._checks.put = (data, callback) => {
    const id = typeof data.payload.id === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
    if (id) {
        const protocol = typeof data.payload.protocol === 'string' && ['https', 'http'].includes(data.payload.protocol) ? data.payload.protocol : false;
        const method = typeof data.payload.method === 'string' && ['post', 'get', 'put', 'delete'].includes(data.payload.method) ? data.payload.method : false;
        const url = typeof data.payload.url === 'string' && data.payload.url.length > 0 ? data.payload.url : false;
        const successCodes = typeof data.payload.successCodes === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
        const timeoutSeconds = typeof data.payload.timeoutSeconds === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

        if (protocol || url || method || successCodes || timeoutSeconds) {
            _data.read('checks', id, (err, checkData) => {
                if (err || !checkData) return callback(404, { Error: 'This check does not exist' });
                // Only let the authenticated users access their object

                // Get the token from the headers
                const token = typeof data.headers.token === 'string' ? data.headers.token : false;

                // Verify the token is valid and belongs to the user
                handlers._tokens.verifyToken(token, checkData.userPhone, tokenIsValid => {
                    if (!tokenIsValid) return callback(403, { Error: 'Missing required token or the token is not valid' });

                    // UPdate the check where necessary
                    if (protocol) checkData.protocol = protocol;
                    if (method) checkData.method = method;
                    if (url) checkData.url = url;
                    if (successCodes) checkData.successCodes = successCodes;
                    if (timeoutSeconds) checkData.timeoutSeconds = timeoutSeconds;
                    _data.update('checks', id, checkData, err => {
                        if (err) return callback(500, { Error: 'Could not update the check' });
                        callback(200);
                    })
                });
            });
        } else {
            callback(400, { Error: 'Nothing to update' });
        }
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Checks - delete
// Required data: id
// Optional data: none
handlers._checks.delete = (data, callback) => {
    const idQuery = data.queryStringObject.get('id');
    const id = typeof idQuery === 'string' && idQuery.trim().length === 20 ? idQuery.trim() : false;
    if (id) {
        _data.read('checks', id, (err, checkData) => {
            if (err || !checkData) return callback(400, { Error: 'Can\'t find the check' });
            // Only let the authenticated users access their object
            // Get the token from the headers
            const token = typeof data.headers.token === 'string' ? data.headers.token : false;

            // Verify the token is valid for the user
            handlers._tokens.verifyToken(token, checkData.userPhone, tokenIsValid => {
                if (!tokenIsValid) return callback(403, { Error: 'Missing required token or the token is not valid' });
                _data.delete('checks', id, err => {
                    if (err) return callback(500, { Error: 'Could not delete the check' });
                    _data.read('users', checkData.userPhone, (err, userData) => {
                        if (err || !userData) return callback(500, { Error: 'Could not update the list of user\'s checks' });
                        const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];
                        const newChecks = userChecks.filter(checkId => checkId != id);
                        userData.checks = newChecks;
                        _data.update('users', checkData.userPhone, userData, err => {
                            if (err) callback(500, { Error: 'Could not update the user\'s check list' });
                            callback(200);
                        });
                    });
                });
            });
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

handlers.ping = (data, callback) => {
    callback(200);
};

handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;