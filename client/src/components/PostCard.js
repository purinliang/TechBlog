import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import PostMeta from "./PostMeta";

export default function PostCard({ post }) {
  return (
    <Card
      variant="outlined"
      sx={{ cursor: "pointer", "&:hover": { boxShadow: 8 } }}
    >
      <Link to={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            fontWeight="600"
            gutterBottom
          >
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.content}
          </Typography>

          <PostMeta
            author={post.author_username}
            createdAt={post.created_at}
            postId={post.id}
            initialLikeCount={post.like_count}
            initiallyLiked={post.liked_by_current_user}
            commentCount={undefined} // optional
          />
        </CardContent>
      </Link>
    </Card>
  );
}
