// server/services/commentService.js
const CommentModel = require("../models/commentModel");
const cacheClient = require("../utils/cacheClient");
const debug = require("debug")("commentService");

const COMMENTS_CACHE_KEY = (postId) => `post:${postId}:comments`;
const COMMENT_COUNT_CACHE_KEY = (postId) => `post:${postId}:comment_count`;

const getRandomTTL = (base = 180, jitter = 60) => {
  return base + Math.floor(Math.random() * jitter); // 180~240 seconds
};

const CommentService = {
  getCommentCountForPost: async (postId) => {
    const key = COMMENT_COUNT_CACHE_KEY(postId);
    debug(`Checking cache for comment count key: ${key}`);

    const cached = await cacheClient.get(key);
    if (cached !== null) {
      debug(`Cache hit for comment count: ${cached}`);
      return Number(cached);
    }

    debug(`Cache miss for ${key}, querying DB...`);
    const comments = await CommentModel.getByPostId(postId);
    const count = comments.length;

    await cacheClient.setEx(
      COMMENTS_CACHE_KEY,
      getRandomTTL(),
      JSON.stringify(comments)
    );
    await cacheClient.setEx(key, getRandomTTL(), count.toString());
    debug(`Cached comment count ${count} for post ${postId} in key ${key}`);

    return count;
  },

  getByPostId: async (postId) => {
    const key = COMMENTS_CACHE_KEY(postId);
    debug(`Checking cache for comments key: ${key}`);

    const cached = await cacheClient.get(key);
    if (cached !== null) {
      debug(`Cache hit for comments`);
      return JSON.parse(cached);
    }

    debug(`Cache miss for ${key}, querying DB...`);
    const comments = await CommentModel.getByPostId(postId);
    const count = comments.length;

    await cacheClient.setEx(key, getRandomTTL(), JSON.stringify(comments));
    await cacheClient.setEx(
      COMMENT_COUNT_CACHE_KEY,
      getRandomTTL(),
      JSON.stringify(count)
    );

    return comments;
  },

  create: async ({ post_id, author_id, content, parent_comment_id = null }) => {
    const comment = await CommentModel.create({
      post_id,
      author_id,
      content,
      parent_comment_id,
    });
    await cacheClient.del(COMMENTS_CACHE_KEY(post_id));
    await cacheClient.del(COMMENT_COUNT_CACHE_KEY(post_id));
    return comment;
  },

  update: async (id, content) => {
    const comment = await CommentModel.update(id, content);

    if (comment?.post_id) {
      await cacheClient.del(COMMENTS_CACHE_KEY(comment.post_id));
      await cacheClient.del(COMMENT_COUNT_CACHE_KEY(comment.post_id));
    }

    return comment;
  },

  delete: async (id) => {
    const comment = await CommentModel.delete(id);

    if (comment?.post_id) {
      await cacheClient.del(COMMENTS_CACHE_KEY(comment.post_id));
      await cacheClient.del(COMMENT_COUNT_CACHE_KEY(comment.post_id));
    }

    return comment;
  },
};

module.exports = CommentService;
