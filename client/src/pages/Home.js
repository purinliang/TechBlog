import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import { getPosts } from "../apis/postApi";
import { CircularProgress, Typography, Box, Alert } from "@mui/material";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
      } finally {
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
        <Typography variant="body" color="text.secondary" mt={8}>
          It may take around 15 seconds to start the backend if it's been idle.
        </Typography>
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
    <>
      <PostList posts={posts} />
    </>
  );
}
