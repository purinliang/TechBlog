const LikeModel = require("../models/likeModel");
const redisClient = require("../utils/redisClient");
const debug = require("debug")("likeService");

const LIKES_CACHE_KEY = (userId) => `likes:user:${userId}`;
const LIKE_COUNT_CACHE_KEY = (postId) => `likes:count:${postId}`;

const getRandomTTL = (base = 120, jitter = 30) => {
  return base + Math.floor(Math.random() * jitter); // 120~150 seconds
};

const LikeService = {
  getPostIdsLikedByUser: async (userId) => {
    const key = LIKES_CACHE_KEY(userId);
    debug(`Checking cache for key: ${key}`);
    const cached = await redisClient.get(key);
    if (cached) {
      debug(`Cache hit for ${key}`);
      return JSON.parse(cached);
    }

    debug(`Cache miss for ${key}, querying DB...`);
    const likedPostIds = await LikeModel.getPostIdsLikedByUser(userId);
    await redisClient.setEx(key, getRandomTTL(), JSON.stringify(likedPostIds));
    debug(`Cached liked post IDs for user ${userId}`);
    return likedPostIds;
  },

  getLikeCountForPost: async (postId) => {
    const key = LIKE_COUNT_CACHE_KEY(postId);
    debug(`Checking cache for like count: ${key}`);
    const cached = await redisClient.get(key);
    if (cached) {
      debug(`Like count cache hit for post ${postId}`);
      return parseInt(cached, 10);
    }

    debug(`Like count cache miss for post ${postId}`);
    const count = await LikeModel.getLikeCountForPost(postId);
    await redisClient.setEx(key, getRandomTTL(), String(count));
    debug(`Cached like count for post ${postId}`);
    return count;
  },

  addLike: async (postId, userId) => {
    debug(`Adding like: user ${userId}, post ${postId}`);
    await LikeModel.addLike(postId, userId);
    await redisClient.del(LIKES_CACHE_KEY(userId));
    await redisClient.del(LIKE_COUNT_CACHE_KEY(postId));
    debug(`Cleared like caches after like`);
  },

  removeLike: async (postId, userId) => {
    debug(`Removing like: user ${userId}, post ${postId}`);
    await LikeModel.removeLike(postId, userId);
    await redisClient.del(LIKES_CACHE_KEY(userId));
    await redisClient.del(LIKE_COUNT_CACHE_KEY(postId));
    debug(`Cleared like caches after unlike`);
  },
};

module.exports = LikeService;
