const getUserDownloads = require('./index');
const express = require('express');

const endpoint = express();

const shieldsSchema = {
  schemaVersion: 1,
  label: 'downloads',
  color: 'teal',
  namedLogo: 'github',
  style: 'social',
  cacheSeconds: 24 * 60 * 60, // 24h
};

endpoint.get('/:user/:token?', async (req, res) => {
  try {
    const userDownloads = await getUserDownloads(req.params.user, req.params.token);

    res.json({
      ...shieldsSchema,
      message: String(userDownloads.total),
    });
  } catch (error) {
    res.status(error.status).json(error.response.data);
  }
});

module.exports = { endpoint };
