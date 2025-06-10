const Redis = require("ioredis");

const isLocal = process.env.USE_LOCAL_REDIS === "true";
const redisUrl = process.env.REDIS_URL;

let connected = false;

const redisClient = new Redis(redisUrl, {
  tls: !isLocal ? {} : undefined,
});

redisClient.on("connect", () => {
  connected = true;
  console.log("🟢 Redis connected");
});

redisClient.on("error", (err) => {
  connected = false;
  console.error("🔴 Redis error:", err);
});

const setEx = async (key, ttl, value) => {
  if (!connected) return;
  try {
    await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  } catch (err) {
    console.warn("⚠️ Redis setEx failed:", err.message);
  }
};

const get = async (key) => {
  if (!connected) return null;
  try {
    const val = await redisClient.get(key);
    return val ? JSON.parse(val) : null;
  } catch (err) {
    console.warn("⚠️ Redis get failed:", err.message);
    return null;
  }
};

const del = async (key) => {
  if (!connected) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.warn("⚠️ Redis del failed:", err.message);
  }
};

const ttl = async (key) => {
  if (!connected) return -2;
  try {
    return await redisClient.ttl(key);
  } catch (err) {
    console.warn("⚠️ Redis ttl failed:", err.message);
    return -2;
  }
};

module.exports = { setEx, get, del, ttl };
