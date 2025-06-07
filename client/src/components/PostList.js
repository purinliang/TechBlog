import { Box, Alert } from "@mui/material";
import PostCard from "../components/PostCard";

export default function PostList({ posts }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 2 }}>
      {posts.length === 0 ? (
        <Alert severity="info" sx={{ py: 1, fontSize: "1rem" }}>
          No posts available. You can login/register and add your first post!
        </Alert>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </Box>
  );
}
