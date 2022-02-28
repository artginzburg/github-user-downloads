/* eslint-disable no-console */
require('dotenv').config();

const getUserDownloads = require('.');

console.time();
getUserDownloads(process.env.USER).then((data) => {
  console.log(data);
  console.timeEnd();
});
