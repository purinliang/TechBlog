// server/utils/redisClient.js
const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL;
const client = createClient({ url: redisUrl });

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await client.connect();
})();

module.exports = client;
