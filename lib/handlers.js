/* 
*
* Request handlers
*
*/

const _data = require('./data');
const helpers = require('./helpers');

const handlers = {};

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
// @TODO Only let the authenticated users access their object
handlers._users.get = (data, callback) => {
    const phone = data.queryStringObject.get('phone');
    const phoneNumber = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    if (phoneNumber) {
        _data.read('users', phoneNumber, (err, userData) => {
            if (err || !userData) return callback(404);
            // Removed the hashed password from the user object
            delete userData.hashedPassword;
            callback(200, userData);
        })
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Users - put
// Required fields: phone
// Optional data: firstName, lastName, password (at least one of those must be specified)
// @TODO Only let the authenticated users access their object
handlers._users.put = (data, callback) => {
    const phone = data.payload.phone;
    const phoneNumber = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    if (phoneNumber) {
        const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
        const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 10 ? data.payload.password.trim() : false;
        if (firstName || lastName || password) {
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
// @TODO Only let the authenticated users access their object
// @TODO Clean up (delete) any other data files for this user
handlers._users.delete = (data, callback) => {
    const phone = data.queryStringObject.get('phone');
    const phoneNumber = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    if (phoneNumber) {
        _data.read('users', phoneNumber, (err, userData) => {
            if (err) return callback(404, { Error: 'Could not find the user' });
            _data.delete('users', phoneNumber, err => {
                if (err) return callback(500, { Error: 'Could not delete the user' })
                console.log('>>> DELETING...')
                callback(200);
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

handlers.sample = (data, callback) => {
    callback(200, data);
};

module.exports = handlers;