// server/routes/likeRoutes.js
const express = require("express");
const router = express.Router();
const LikeService = require("../services/likeService");
const verifyToken = require("../middleware/auth");

const logRequest = (req) => {
  console.log(`Received ${req.method} request for: ${req.originalUrl}`);
};

router.post("/:postId/like", verifyToken, async (req, res) => {
  logRequest(req);
  const { postId } = req.params;
  try {
    await LikeService.addLike(postId, req.user.userId);
    res.status(200).json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:postId/unlike", verifyToken, async (req, res) => {
  logRequest(req);
  const { postId } = req.params;
  try {
    await LikeService.removeLike(postId, req.user.userId);
    res.status(200).json({ message: "Post unliked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
