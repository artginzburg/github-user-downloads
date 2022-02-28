#!/usr/bin/env node
/* eslint-disable no-console */
const getUserDownloads = require('.');

async function displayUserDownloads(username) {
  console.log(await getUserDownloads(username));
}

const lastArgument = process.argv[process.argv.length - 1];

if (lastArgument.includes('/')) {
  console.log(`No username provided as an argument — Fetching GitHub downloads for $USER — ${process.env.USER}...`);
  displayUserDownloads(process.env.USER);
} else {
  console.log(`Fetching GitHub downloads for ${lastArgument}...`);
  displayUserDownloads(lastArgument);
}
