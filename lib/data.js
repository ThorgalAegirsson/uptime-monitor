/*
* Library for storing and editing data
*
*/

const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const lib = {};

// Base dir of the data folder
lib.baseDir = path.join(__dirname, '../.data/');

// Writing data to a file
lib.create = (dir, file, data, callback) => {
    //Open the file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to a string
            const stringData = JSON.stringify(data);

            // write to file and close it
            fs.writeFile(fileDescriptor, stringData, err => {
                if (err) return callback('Error writing to new file');
                fs.close(fileDescriptor, err => {
                    if (err) return callback('Error closing new file');
                    callback(false);
                });
            });
        } else {
            callback('Could not create new file, it may already exist')
        }
    });
};

// Read data from a file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
        if (err) return callback(err, data);
        callback(null, helpers.parseJsonToObject(data));
    });
};

// Update existing file
lib.update = (dir, file, data, callback) => {
    //Open the file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to a string
            const stringData = JSON.stringify(data);

            // Truncate the file
            fs.ftruncate(fileDescriptor, (err) => {
                if (err) return callback('Error truncating file');
                // write to file and close it
                fs.writeFile(fileDescriptor, stringData, err => {
                    if (err) return callback('Error writing to existing file');
                    fs.close(fileDescriptor, err => {
                        if (err) return callback('Error closing the file');
                        callback(false);
                    });
                });
            });
        } else {
            callback('Could not open the file for updating, it may not exist yet')
        }
    });
};

// Delete existing file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, err => {
        if (err) return callback('Could not delete the file')
        callback(null);
    });
};

// List all the items in a directory
lib.list = (dir, callback) => {
    fs.readdir(`${lib.baseDir}${dir}/`, (err, fileList) => {
        if (err || !fileList || fileList.length === 0) return callback(err, fileList);
        const fileNames = fileList.map(file => file.replace('.json', ''));
        callback(null, fileNames);
    });
};


module.exports = lib;