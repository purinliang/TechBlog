// server/services/likeService.js
const LikeModel = require("../models/likeModel");
const redisClient = require("../utils/redisClient");
const debug = require("debug")("likeService");

const LIKES_CACHE_KEY = (userId) => `likes:user:${userId}`;
const ONE_MINUTE = 5; // seconds

const LikeService = {
  getLikedPostIds: async (userId) => {
    const key = LIKES_CACHE_KEY(userId);

    debug(`Checking cache for key: ${key}`);
    const cached = await redisClient.get(key);
    if (cached) {
      debug(`Cache hit for ${key}`);
      return JSON.parse(cached);
    }

    debug(`Cache miss for ${key}, querying DB...`);
    const likedPostIds = await LikeModel.getLikedPostIds(userId);
    await redisClient.setEx(key, ONE_MINUTE, JSON.stringify(likedPostIds));
    debug(`Cached liked post IDs for user ${userId}`);

    return likedPostIds;
  },

  addLike: async (postId, userId) => {
    debug(`Adding like: user ${userId}, post ${postId}`);
    await LikeModel.addLike(postId, userId);
    await redisClient.del(LIKES_CACHE_KEY(userId));
    debug(`Cache cleared for user ${userId} after like`);
  },

  removeLike: async (postId, userId) => {
    debug(`Removing like: user ${userId}, post ${postId}`);
    await LikeModel.removeLike(postId, userId);
    await redisClient.del(LIKES_CACHE_KEY(userId));
    debug(`Cache cleared for user ${userId} after unlike`);
  },
};

module.exports = LikeService;
