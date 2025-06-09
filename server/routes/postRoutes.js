// server/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const PostModel = require("../models/postModel");
const verifyToken = require("../middleware/auth");

const logRequest = (req) => {
  console.log(`Received ${req.method} request for: ${req.originalUrl}`);
};

router.get("/", verifyToken.optional, async (req, res) => {
  const start = process.hrtime.bigint();
  logRequest(req);

  const userId = req.user?.userId || null;
  try {
    const dbStart = process.hrtime.bigint();
    const posts = await PostModel.getAll(userId);
    const dbEnd = process.hrtime.bigint();
    const end = process.hrtime.bigint();
    const total = Number(end - start) / 1e6; // ms
    const dbMs = Number(dbEnd - dbStart) / 1e6; // ms
    const appMs = total - dbMs; // ms
    console.log(
      `[TIMING] ${req.method} ${req.path} : ` +
        `TOTAL: ${total.toFixed(1)}ms, ` +
        `db: ${dbMs.toFixed(1)}ms, ` +
        `app: ${appMs.toFixed(1)}ms`
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
    const posts = await PostModel.getMyAll(userId);
    res.json(posts);
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
    const post = await PostModel.getById(req.params.id, userId);
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
