require('dotenv').config();

const getUserDownloads = require('.');

console.time();
getUserDownloads(process.env.USER).then((console.timeEnd, console.log));
