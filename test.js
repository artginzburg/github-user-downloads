const getUserDownloads = require('./index.js');

require('dotenv').config();

getUserDownloads(({ USER = 'artginzburg', PERSONAL_ACCESS_TOKEN } = process.env)).then(console.log);
