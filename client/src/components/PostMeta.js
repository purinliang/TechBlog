import { useState } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { likePost, unlikePost } from "../apis/likeApi";

export default function PostMeta({
  author,
  createdAt,
  initialLikeCount,
  initiallyLiked,
  postId,
  commentCount,
}) {
  const [likeCount, setLikeCount] = useState(Number(initialLikeCount) || 0);
  const [liked, setLiked] = useState(initiallyLiked || false);

  const handleLikeClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to like posts.");
      return;
    }

    try {
      if (liked) {
        await unlikePost(postId);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(postId);
        setLikeCount((prev) => prev + 1);
      }
      setLiked((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 4 }}>
      <Typography variant="body2" color="text.secondary">
        posted by {author || "Unknown"} | at{" "}
        {new Date(createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })}{" "}
        |
      </Typography>

      <Tooltip title={liked ? "Unlike" : "Like"}>
        <Button
          onClick={handleLikeClick}
          variant="text"
          size="small"
          color="error"
          sx={{ minWidth: 0, padding: 0 }}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Button>
      </Tooltip>

      <Typography variant="body2" color="text.secondary">
        {likeCount}
      </Typography>

      {commentCount !== undefined && (
        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          💬 {commentCount} comments
        </Typography>
      )}
    </Box>
  );
}
