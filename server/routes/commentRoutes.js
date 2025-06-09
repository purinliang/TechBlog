// server/routes/commentRoutes.js
const express = require("express");
const CommentModel = require("../models/commentModel");
const verifyToken = require("../middleware/auth");

const router = express.Router();

const logRequest = (req) => {
  console.log(`Received ${req.method} request for: ${req.originalUrl}`);
};

router.get("/post/:postId", async (req, res) => {
  logRequest(req);
  try {
    const postId = req.params.postId;
    const comments = await CommentModel.getByPostId(postId);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get comments" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  logRequest(req);
  const userId = req.user?.userId;
  try {
    const { post_id, content, parent_comment_id } = req.body;
    const newComment = await CommentModel.create({
      post_id,
      author_id: userId,
      content,
      parent_comment_id,
    });
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  logRequest(req);
  const commentId = req.params.id;
  try {
    const { content } = req.body;
    const result = await CommentModel.update(commentId, content);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  logRequest(req);
  const commentId = req.params.id;
  try {
    const result = await CommentModel.delete(commentId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
