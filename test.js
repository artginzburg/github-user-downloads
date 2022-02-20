const getUserDownloads = require('./');

require('dotenv').config();

const { USER = 'artginzburg', PERSONAL_ACCESS_TOKEN } = process.env;

const timeLabel = 'github-user-downloads';

console.time(timeLabel);
getUserDownloads(USER, PERSONAL_ACCESS_TOKEN).then((data) => {
  console.log(data);
  console.timeEnd(timeLabel);
});
