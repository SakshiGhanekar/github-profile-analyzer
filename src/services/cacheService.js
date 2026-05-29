const redis = require('redis');
const config = require('../config');

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: config.redis.url,
    socket: {
      reconnectStrategy: false // Don't crash the app by infinite reconnects if Redis isn't running locally
    }
  });

  redisClient.on('error', (error) => console.warn(`Redis Warning (Cache Disabled): ${error.message}`));

  try {
    await redisClient.connect();
    console.log('Redis connected successfully for caching.');
  } catch (error) {
    console.warn('Redis connection failed, continuing without cache.');
  }
})();

const getCache = async (key) => {
  try {
    if (!redisClient || !redisClient.isReady) return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error fetching cache for key ${key}:`, error.message);
    return null;
  }
};

const setCache = async (key, value, durationInSeconds = 3600) => {
  try {
    if (!redisClient || !redisClient.isReady) return;
    await redisClient.setEx(key, durationInSeconds, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error.message);
  }
};

module.exports = {
  getCache,
  setCache
};
