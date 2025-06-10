const PostModel = require("../models/postModel");
const cacheClient = require("../utils/cacheClient");
const debug = require("debug")("postService");

const POSTS_CACHE_KEY = "posts:all";
const MY_POSTS_CACHE_KEY = (userId) => `user:${userId}:posts`;
const POST_BY_ID_CACHE_KEY = (postId) => `post:${postId}`;

const getRandomTTL = (base = 300, jitter = 60) => {
  return base + Math.floor(Math.random() * jitter); // 180~240 seconds
};

const PostService = {
  getAllPublic: async () => {
    const key = POSTS_CACHE_KEY;
    debug(`Checking cache for key: ${key}`);

    const cached = await cacheClient.get(key);
    if (cached) {
      debug(`Cache hit for ${key}`);
      return JSON.parse(cached);
    }

    debug(`Cache miss for ${key}, querying DB...`);
    const posts = await PostModel.getAllPublic();
    await cacheClient.setEx(key, getRandomTTL(), JSON.stringify(posts));
    debug(`Cached public posts to ${key}`);

    return posts;
  },

  getMyAllPublic: async (userId) => {
    const key = MY_POSTS_CACHE_KEY(userId);
    debug(`Checking cache for key: ${key}`);

    const cached = await cacheClient.get(key);
    if (cached) {
      debug(`Cache hit for ${key}`);
      return JSON.parse(cached);
    }

    debug(`Cache miss for ${key}, querying DB...`);
    const posts = await PostModel.getMyAllPublic(userId);
    await cacheClient.setEx(key, getRandomTTL(), JSON.stringify(posts));
    debug(`Cached user's public posts to ${key}`);

    return posts;
  },

  getPostsByIds: async (postIds) => {
    const posts = await PostModel.getPostsByIds(postIds);
    return posts;
  },

  getByIdPublic: async (postId) => {
    const key = POST_BY_ID_CACHE_KEY(postId);
    debug(`Checking cache for key: ${key}`);

    const cached = await cacheClient.get(key);
    if (cached) {
      debug(`Cache hit for ${key}`);
      return JSON.parse(cached);
    }

    debug(`Cache miss for ${key}, querying DB...`);
    const post = await PostModel.getByIdPublic(postId);
    await cacheClient.setEx(key, getRandomTTL(), JSON.stringify(post));
    debug(`Cached post ${postId} to ${key}`);

    return post;
  },

  async create(title, content, userId) {
    debug(`Creating post by user ${userId}`);
    const result = await PostModel.create(title, content, userId);
    await cacheClient.del(POSTS_CACHE_KEY);
    debug(`Cache cleared for ${POSTS_CACHE_KEY} after post creation`);
    return result;
  },

  async update(id, title, content) {
    debug(`Updating post ${id}`);
    const result = await PostModel.update(id, title, content);
    await cacheClient.del(POSTS_CACHE_KEY);
    await cacheClient.del(POST_BY_ID_CACHE_KEY(id));
    debug(
      `Cache cleared for ${POSTS_CACHE_KEY} and ${POST_BY_ID_CACHE_KEY(
        id
      )} after post update`
    );
    return result;
  },

  async delete(id) {
    debug(`Deleting post ${id}`);
    const result = await PostModel.delete(id);
    await cacheClient.del(POSTS_CACHE_KEY);
    await cacheClient.del(POST_BY_ID_CACHE_KEY(id));
    debug(
      `Cache cleared for ${POSTS_CACHE_KEY} and ${POST_BY_ID_CACHE_KEY(
        id
      )} after post delete`
    );
    return result;
  },
};

module.exports = PostService;
