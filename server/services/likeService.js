// server/services/likeService.js
const LikeModel = require("../models/likeModel");
const redisClient = require("../utils/redisClient");
const debug = require("debug")("likeService");

const ONE_MINUTE = 60;

const LikeService = {
  getLikedPostIds: async (userId) => {
    const cacheKey = `likes:user:${userId}`;

    debug(`Checking cache for key: ${cacheKey}`);
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      debug(`Cache hit for ${cacheKey}`);
      return JSON.parse(cached);
    }

    debug(`Cache miss for ${cacheKey}, querying DB...`);
    const likedPostIds = await LikeModel.getLikedPostIds(userId);
    await redisClient.setEx(cacheKey, ONE_MINUTE, JSON.stringify(likedPostIds));
    debug(`Cached liked post IDs for user ${userId}`);

    return likedPostIds;
  },

  addLike: async (postId, userId) => {
    debug(`Adding like: user ${userId}, post ${postId}`);
    await LikeModel.addLike(postId, userId);
    await redisClient.del(`likes:user:${userId}`);
    debug(`Cache cleared for user ${userId} after like`);
  },

  removeLike: async (postId, userId) => {
    debug(`Removing like: user ${userId}, post ${postId}`);
    await LikeModel.removeLike(postId, userId);
    await redisClient.del(`likes:user:${userId}`);
    debug(`Cache cleared for user ${userId} after unlike`);
  },
};

module.exports = LikeService;
