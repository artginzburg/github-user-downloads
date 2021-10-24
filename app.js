import getUserDownloads from './index.js';
import express from 'express';

const app = express();

const shieldsSchema = {
  schemaVersion: 1,
  label: 'downloads',
  color: 'teal',
  namedLogo: 'github',
  style: 'social',
  cacheSeconds: 24 * 60 * 60, // 24h
};

app.get('/:user', async (req, res) => {
  const userDownloads = await getUserDownloads(req.params.user);

  res.end(
    JSON.stringify({
      ...shieldsSchema,
      message: String(userDownloads.total),
    }),
  );
});

module.exports.endpoint = app;
