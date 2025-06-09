import { useState } from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Reply from "@mui/icons-material/Reply";
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

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const handleLikeClick = async (event) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      alert("Please login/register first.");
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
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "flex-end",
        mt: 4,
      }}
    >
      {/* Left Section: Author + Time */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: { xs: "left", sm: "inherit" },
          width: "100%",
        }}
      >
        by {author || "Unknown"} | at{" "}
        {new Date(createdAt + "Z").toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })}
      </Typography>

      {/* Right Section: Likes + Comments */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Like Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isLoggedIn ? (
            <Tooltip title={liked ? "Unlike" : "Like"} arrow>
              <IconButton
                onClick={handleLikeClick}
                color="error"
                size="small"
                aria-label={liked ? "Unlike post" : "Like post"}
              >
                {liked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Please login/register first" arrow>
              <span>
                <IconButton
                  disabled
                  color="error"
                  size="small"
                  aria-label="Like post (login required)"
                  sx={{ cursor: "default" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 0.5, userSelect: "none" }}
          >
            {likeCount}
          </Typography>
        </Box>

        {/* Comment Section */}
        <Tooltip title="Comments" arrow>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "default",
            }}
          >
            <Reply fontSize="small" color="action" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 0.5, userSelect: "none" }}
            >
              {commentCount}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
