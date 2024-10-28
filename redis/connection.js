const Redis = require("ioredis");

// Redis URL connection
// const redis = new Redis("redis://127.0.0.1:6379"); 
// const redis = new Redis(6379); // 127.0.0.1:6380
// const redis = new Redis(6379, "127.0.0.1");
const redis = new Redis(); // by default connected to localhost

// Event listeners for connection status
redis.on('connect', () => {
  console.log('Connecting to Redis...');
});

redis.on('ready', () => {
  console.log('Connected to Redis successfully!');
});

redis.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});



module.exports = redis;