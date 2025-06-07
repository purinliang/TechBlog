import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import { getMyPosts } from "../apis/postApi";
import { CircularProgress, Box, Alert } from "@mui/material";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getMyPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching my posts:", error);
        setError("Failed to load my posts.");
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
