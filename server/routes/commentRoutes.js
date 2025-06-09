// commentRoutes.js
const express = require("express");
const CommentModel = require("../models/commentModel");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await CommentModel.getByPostId(req.params.postId);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get comments" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { post_id, content, parent_comment_id } = req.body;
    const newComment = await CommentModel.create({
      post_id,
      author_id: req.user.id,
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
  try {
    const { content } = req.body;
    const result = await CommentModel.update(req.params.id, content);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const result = await CommentModel.delete(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
