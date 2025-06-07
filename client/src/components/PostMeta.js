import { Box, Typography, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function PostMeta({
  author,
  createdAt,
  likeCount,
  liked,
  onLikeClick,
  commentCount, // optional, default 0
}) {
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

      <Button
        onClick={onLikeClick}
        variant="text"
        size="small"
        color="error"
        sx={{ minWidth: 0, padding: 0 }}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </Button>

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
