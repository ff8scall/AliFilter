const https = require('https');

const RAW_URL = 'https://raw.githubusercontent.com/ff8scall/AliFilter/main/promotions.json';

https.get(RAW_URL, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('SUCCESS: Successfully fetched and parsed promotions.json');
      console.log('Tracking ID:', json.meta.trackingId);
      console.log('Updated At:', json.meta.updatedAt);
      console.log('Coupons Count:', json.coupons.length);
      console.log('Hotdeals Count:', json.hotdeals.length);
      process.exit(0);
    } catch (e) {
      console.error('ERROR parsing JSON:', e.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Network Error:', err.message);
  process.exit(1);
});
