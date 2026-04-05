const http = require('http');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const data = JSON.stringify({
  id: "",
  title: "Test",
  description: "Test",
  address: "123 Test St",
  phone: "1234567890",
  whatsapp: "1234567890",
  email: "test@example.com",
  status: "approved",
  data: {}
});

const options = {
  hostname: 'localhost',
  port: PORT,
  path: '/api/contacts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${responseBody}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
