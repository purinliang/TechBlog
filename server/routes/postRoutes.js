const express = require("express");
const router = express.Router();
const PostModel = require("../models/postModel");
const verifyToken = require("../middleware/auth");

const logRequest = (req) => {
  // console.log(`Received ${req.method} request for: ${req.originalUrl}`);
};

router.get("/", async (req, res) => {
  logRequest(req);
  
  try {
    const posts = await PostModel.getAll();
    res.json(posts);
  } catch (err) {
    console.error(`Error fetching posts: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  logRequest(req);

  if (!req.params.id) {
    return res.status(400).json({ error: "Post ID is required." });
  }
  try {
    const post = await PostModel.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
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
    const result = await PostModel.create(title, content, req.user.userId);
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

    const result = await PostModel.update(req.params.id, title, content);
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
    const post = await PostModel.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author_id !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    const result = await PostModel.delete(req.params.id);
    res.json(result);
    console.log(`Post deleted with ID: ${req.params.id}`);
  } catch (err) {
    console.error(`Error deleting post ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
