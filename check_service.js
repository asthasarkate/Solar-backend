const http = require('http');

const data = Buffer.from('test');

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/predict',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', JSON.stringify(res.headers));
    console.log('Body:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.log('Error:', e.code);
  process.exit(2);
});

req.write(data);
req.end();