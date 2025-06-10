// utils/cacheClient.js
const { LRUCache } = require("lru-cache");
const redisClient = require("./redisClient");

const debug = require("debug")("cacheClient");

const LRU_TTL = 30 * 1000;
const memoryCache = new LRUCache({
  max: 1000,
  ttl: 1000 * 30, // 30 seconds
});

const REFRESH_THRESHOLD = 45; // seconds

const cacheClient = {
  get: async (key) => {
    const memValue = memoryCache.get(key);
    if (memValue !== undefined) {
      debug(`🟢 LRU cache hit for key: ${key}`);
      return memValue;
    }

    debug(`🟡 LRU miss, checking Redis for key: ${key}`);
    const redisValue = await redisClient.get(key);
    if (redisValue !== null) {
      memoryCache.set(key, redisValue);
      debug(`🟢 Redis cache hit, promoted to LRU for key: ${key}`);
    }
    return redisValue;
  },

  setEx: async (key, ttl, value) => {
    memoryCache.set(key, value, { ttl: LRU_TTL });
    await redisClient.setEx(key, ttl, value);
    debug(`Set key in both LRU and Redis: ${key}`);
  },

  del: async (key) => {
    memoryCache.delete(key);
    await redisClient.del(key);
    debug(`Deleted key from both LRU and Redis: ${key}`);
  },

  shouldRefresh: async (key) => {
    const ttl = await redisClient.ttl(key);
    return ttl > 0 && ttl < REFRESH_THRESHOLD;
  },
};

module.exports = cacheClient;
