// server/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const PostModel = require("../models/postModel");
const verifyToken = require("../middleware/auth");
const PostService = require("../services/postService");
const LikeService = require("../services/likeService");

const logRequest = (req) => {
  console.log(`Received ${req.method} request for: ${req.originalUrl}`);
};

router.get("/", verifyToken.optional, async (req, res) => {
  logRequest(req);

  const userId = req.user?.userId || null;
  try {
    const posts = await PostService.getAll(userId);
    let likedPostIds = [];
    if (userId) {
      likedPostIds = await LikeService.getPostIdsLikedByUser(userId);
    }

    await Promise.all(
      posts.map(async (post) => {
        post.liked_by_user = likedPostIds.includes(post.id);
        post.like_count = await LikeService.getLikeCountForPost(post.id);
      })
    );
    res.json(posts);
  } catch (err) {
    console.error(`Error fetching posts: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.get("/myposts", verifyToken, async (req, res) => {
  logRequest(req);

  const userId = req.user?.userId;
  try {
    const myposts = await PostService.getMyAll(userId);
    let likedPostIds = [];
    if (userId) {
      likedPostIds = await LikeService.getPostIdsLikedByUser(userId);
    }

    await Promise.all(
      myposts.map(async (post) => {
        post.liked_by_user = likedPostIds.includes(post.id);
        post.like_count = await LikeService.getLikeCountForPost(post.id);
      })
    );
    res.json(myposts);
  } catch (err) {
    console.error(`Error fetching my posts: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", verifyToken.optional, async (req, res) => {
  logRequest(req);

  if (!req.params.id) {
    return res.status(400).json({ error: "Post ID is required." });
  }

  try {
    const userId = req.user?.userId || null;
    const post = await PostService.getById(req.params.id, userId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (userId) {
      const likedPostIds = await LikeService.getPostIdsLikedByUser(userId);
      post.liked_by_user = likedPostIds.includes(post.id);
    }

    post.like_count = await LikeService.getLikeCountForPost(post.id);
    res.json(post);
  } catch (err) {
    console.error(`Error fetching post ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  logRequest(req);
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await PostService.create(title, content, req.user.userId);
    res.status(201).json({ id: result.id });
    console.log(`Post created with ID: ${result.id}`);
  } catch (err) {
    console.error(`Error creating post: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  logRequest(req);
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const post = await PostModel.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author_id !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this post" });
    }

    const result = await PostService.update(req.params.id, title, content);
    res.json(result);
    console.log(`Post updated with ID: ${req.params.id}`);
  } catch (err) {
    console.error(`Error updating post ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  logRequest(req);

  if (!req.params.id) {
    return res.status(400).json({ error: "Post ID is required." });
  }

  try {
    const post = await PostService.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author_id !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    const result = await PostService.delete(req.params.id);
    res.json(result);
    console.log(`Post deleted with ID: ${req.params.id}`);
  } catch (err) {
    console.error(`Error deleting post ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
