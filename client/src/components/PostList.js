import { useEffect, useState } from "react";
import { getPosts } from "../apis/postApi";
import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import PostCard from "../components/PostCard";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingTip, setShowLoadingTip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingTip(true);
    }, 3000);

    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
        {showLoadingTip && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            It may take around 15 seconds to start the backend if it's been
            idle.
          </Typography>
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert
          severity="error"
          sx={{
            py: 1,
            fontSize: "1rem",
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

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
