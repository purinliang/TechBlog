const express = require("express");
const router = express.Router();
const PostModel = require("../models/postModel");

const logRequest = (req) => {
  console.log(`Received ${req.method} request for: ${req.originalUrl}`);
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
  try {
    const post = await PostModel.getById(req.params.id);
    if (!post) {
      console.warn(`Post not found for ID: ${req.params.id}`);
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(`Error fetching post ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  logRequest(req);
  const { title, content } = req.body;
  if (!title || !content) {
    console.warn("Missing title or content");
    return res.status(400).json({ error: "Missing title or content" });
  }

  try {
    const result = await PostModel.create(title, content);
    res.status(201).json({ id: result.id });
    console.log(`Post created with ID: ${result.id}`);
  } catch (err) {
    console.error(`Error creating post: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  logRequest(req);
  const { title, content } = req.body;
  try {
    const result = await PostModel.update(req.params.id, title, content);
    res.json(result);
    console.log(`Post updated with ID: ${req.params.id}`);
  } catch (err) {
    console.error(`Error updating post ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  logRequest(req);
  try {
    const result = await PostModel.delete(req.params.id);
    res.json(result);
    console.log(`Post deleted with ID: ${req.params.id}`);
  } catch (err) {
    console.error(`Error deleting post ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
