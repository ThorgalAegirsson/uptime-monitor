/*
*
* Library for storing and rotating logs
*
*/

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const lib = {};

// Base directory for logs
lib.baseDir = path.join(__dirname, '../.logs/');

// Append a string to a file. Create the file if it does not exist
lib.append = (fileName, logString, callback) => {
    // Open the file for appending
    fs.open(`${lib.baseDir}${fileName}.log`, 'a', (err, fileDescriptor) => {
        if (err || !fileDescriptor) return callback('Could not open file for appending the log');
        // Append to the file and close it
        fs.appendFile(fileDescriptor, `${logString}\n`, err => {
            if (err) return callback('Error appending to file');
            fs.close(fileDescriptor, err => {
                if (err) return callback('Error closing file that was being appended');
                callback(null);
            });
        });
    });
};

// List all the logs with optional compressed files
lib.list = (includeCompressedLogs, callback) => {
    fs.readdir(lib.baseDir, (err, data) => {
        if (err || !data || !data.length) return callback(err, data);
        const trimmedFileNames = [];
        data.forEach(fileName => {
            // Add .log files
            if (fileName.includes('.log')) trimmedFileNames.push(fileName);
            // Add .gz files
            if (includeCompressedLogs && fileName.includes('.gz.b64')) trimmedFileNames.push(fileName);
        });
        callback(null, trimmedFileNames);
    });
};

// Compress the contents of a log file into a .gz.b64 file within the same directory
lib.compress = (sourceFile, newFileId, callback) => {
    const destFile = `${newFileId}.gz.b64`;
    // Read the source file
    fs.readFile(`${lib.baseDir}${sourceFile}`, 'utf8', (err, inputString) => {
        if (err || !inputString) return callback(err);
        // Compress the data using gzip
        zlib.gzip(inputString, (err, buffer) => {
            if (err) return callback(err);
            // Send the compressed data to the destFile
            fs.open(`${lib.baseDir}${destFile}`, 'wx', (err, fileDescriptor) => {
                if (err || !fileDescriptor) return callback(err);
                //Write to the destFile
                fs.writeFile(fileDescriptor, buffer.toString('base64'), err => {
                    if (err) return callback(err);
                    // Close the destFile
                    fs.close(fileDescriptor, err => {
                        if (err) return callback(err);
                        return callback(null);
                    });
                });
            });
        });
    });
};

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = (fileId, callback) => {
    const fileName = `${fileId}.gz.b64`;
    fs.readFile(`${lib.baseDir}${fileId}`, 'utf8', (err, str) => {
        if (err) return callback(err);
        // Decompress the data
        const inputBuffer = Buffer.from(str, 'base64');
        zlib.unzip(inputBuffer, (err, outputBuffer) => {
            if (err || !outputBuffer) return callback(err);
            const str = outputBuffer.toString();
            callback(null, str);
        });
    });
};

// Truncate a log file
lib.truncate = (logId, callback) => {
    fs.truncate(`${lib.baseDir}${logId}`, err => {
        if (err) return callback(err);
        callback(null);
    });
};

module.exports = lib;