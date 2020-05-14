/*
*
* Create and export configuration variables
*
* in PowerShell you start it as:
* PS C:\path\to\your\project> $env:NODE_ENV="production";node index.js
* in Linux:
* some-user@some-linux path/to/your/project $ NODE_ENV=production node index.js
*
*/

// container for all the environments
const environments = {};

// Staging environment (default)
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashSecret: 'thisisasecret'
};

// Production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashSecret: 'thisisasecret'
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const environmentToExport = environments[currentEnvironment] || environments.staging;

module.exports = environmentToExport;