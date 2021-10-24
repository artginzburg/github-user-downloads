import dotenv from 'dotenv';
import getUserDownloads from './index.js';

dotenv.config();

getUserDownloads(({ USER = 'artginzburg', PERSONAL_ACCESS_TOKEN } = process.env)).then(console.log);
