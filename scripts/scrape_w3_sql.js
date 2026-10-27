const https = require('https');
const fs = require('fs');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = 'https://www.w3schools.com/sql/' + redirectUrl;
        }
        return resolve(fetchPage(redirectUrl));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching default.asp...');
  const html = await fetchPage('https://www.w3schools.com/sql/default.asp');
  console.log('HTML size:', html.length);
  fs.writeFileSync('scripts/w3_default.html', html, 'utf8');

  // Regex to extract all SQL tutorial navigation links
  // <a target="_top" href="sql_intro.asp">SQL Intro</a>
  const regex = /<a[^>]+href=["'](sql_[^"']+\.asp)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  const links = [];
  const seen = new Set();
  while ((match = regex.exec(html)) !== null) {
    const file = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (!seen.has(file)) {
      seen.add(file);
      links.push({ file, text });
    }
  }

  console.log('Total unique SQL lesson links found:', links.length);
  console.log(JSON.stringify(links, null, 2));
  fs.writeFileSync('scripts/w3_sql_links.json', JSON.stringify(links, null, 2), 'utf8');
}

main().catch(console.error);
