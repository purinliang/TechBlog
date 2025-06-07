const express = require("express");
const router = express.Router();
const LikeModel = require("../models/likeModel");
const verifyToken = require("../middleware/auth");

const logRequest = (req) => {
  console.log(`Received ${req.method} request for: ${req.originalUrl}`);
};

// router.get("/:postId/count", async (req, res) => {
//   logRequest(req);

//   const { postId } = req.params;
//   try {
//     const count = await LikeModel.getLikesCount(postId);
//     res.json({ postId, likes: count });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/:postId/status", verifyToken, async (req, res) => {
//   logRequest(req);

//   const { postId } = req.params;
//   const userId = req.user.userId;
//   try {
//     const count = await LikeModel.getLikesCount(postId);
//     const liked = await LikeModel.checkIfLiked(postId, userId);
//     res.status(200).json({ count, likedByCurrentUser: liked });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/:postId/like", verifyToken, async (req, res) => {
  logRequest(req);

  const { postId } = req.params;
  try {
    await LikeModel.addLike(postId, req.user.userId);
    res.status(200).json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:postId/unlike", verifyToken, async (req, res) => {
  logRequest(req);

  const { postId } = req.params;
  try {
    await LikeModel.removeLike(postId, req.user.userId);
    res.status(200).json({ message: "Post unliked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
