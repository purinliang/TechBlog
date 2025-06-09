const PostModel = require("../models/postModel");
const redisClient = require("../utils/redisClient");

const POSTS_CACHE_KEY = "posts:all";
const MY_POSTS_CACHE_KEY = (userId) => `user:${userId}:posts`;
const POST_BY_ID_KEY = (postId) => `post:${postId}`;
const CACHE_TTL = 60; // 60 seconds

const PostService = {
  getAll: async () => {
    const key = POSTS_CACHE_KEY;
    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);

    const posts = await PostModel.getAllPublic();
    await redisClient.setEx(key, CACHE_TTL, JSON.stringify(posts));
    return posts;
  },

  getMyAll: async (userId) => {
    const key = MY_POSTS_CACHE_KEY(userId);
    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);

    const posts = await PostModel.getMyAllPublic(userId);
    await redisClient.setEx(key, CACHE_TTL, JSON.stringify(posts));
    return posts;
  },

  getById: async (postId) => {
    const key = POST_BY_ID_KEY(postId);
    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);

    const post = await PostModel.getByIdPublic(postId);
    await redisClient.setEx(key, CACHE_TTL, JSON.stringify(post));
    return post;
  },

  async create(title, content, userId) {
    const result = await PostModel.create(title, content, userId);
    await redisClient.del(POSTS_KEY);
    return result;
  },

  async update(id, title, content) {
    const result = await PostModel.update(id, title, content);
    await redisClient.del(POSTS_KEY);
    return result;
  },

  async delete(id) {
    const result = await PostModel.delete(id, title, content);
    await redisClient.del(POSTS_KEY);
    return result;
  },
};

module.exports = PostService;
