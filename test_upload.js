const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function main() {
  // Create a test image
  const testImgPath = path.join(__dirname, 'test_image.jpg');
  const buf = Buffer.from('fake jpeg data', 'binary');
  fs.writeFileSync(testImgPath, buf);

  let token;

  try {
    // Login instead of register
    const loginResp = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123',
    });
    token = loginResp.data.token;
    console.log('Logged in, got token');

    // Upload image with JWT
    const form = new (require('form-data'))();
    form.append('image', fs.createReadStream(testImgPath));

    const uploadResp = await axios.post(`${BASE_URL}/api/analyze`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Upload success:', uploadResp.status);
    console.log('Response:', JSON.stringify(uploadResp.data, null, 2));

    // Cleanup
    fs.unlinkSync(testImgPath);
  } catch (error) {
    console.error('Error response status:', error.response?.status);
    console.error('Error response data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);

    // Cleanup
    try { fs.unlinkSync(testImgPath); } catch (e) {}
  }
}

main();