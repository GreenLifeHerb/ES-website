const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'a3b7d82b4c1a47f9a1f2e8b6c4d7f5e3';
const HOST = 'essencesourceusa.com';
const INDEXNOW_URLS = [
  'api.indexnow.org',
  'www.bing.com',
  'yandex.com'
];

const ROOT_DIR = path.resolve(__dirname, '../../');

function getAllHtmlUrls() {
  const files = fs.readdirSync(ROOT_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => file === 'index.html' ? `https://${HOST}/` : `https://${HOST}/${file}`);
  return files;
}

function pingIndexNow() {
  const urls = getAllHtmlUrls();
  console.log(`Found ${urls.length} URLs to submit to IndexNow.`);

  const payload = JSON.stringify({
    host: HOST,
    key: API_KEY,
    keyLocation: `https://${HOST}/${API_KEY}.txt`,
    urlList: urls
  });

  INDEXNOW_URLS.forEach(endpoint => {
    const options = {
      hostname: endpoint,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`[SUCCESS] Submitted to ${endpoint} (${res.statusCode})`);
        } else {
          console.error(`[ERROR] Failed to submit to ${endpoint}. Status: ${res.statusCode}. Details: ${data}`);
        }
      });
    });

    req.on('error', error => {
      console.error(`[ERROR] Request to ${endpoint} failed:`, error.message);
    });

    req.write(payload);
    req.end();
  });
}

pingIndexNow();
