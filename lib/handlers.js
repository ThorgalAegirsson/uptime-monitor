/* 
*
* Request handlers
*
*/

const _data = require('./data');
const helpers = require('./helpers');

const handlers = {};

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
                    if (err || !userData) return callback(404, {Error: 'This user does not exist'});
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
// @TODO Clean up (delete) any other data files for this user
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
                    callback(200);
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
            if (err || !userData) return callback(400, { Error: 'Could not specified user' });
            // compare hashed sent password with the stored hashed password
            const hashedPassword = helpers.hash(password);
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
                })
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
}

handlers.ping = (data, callback) => {
    callback(200);
};

handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;