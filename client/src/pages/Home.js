import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import { getPosts } from "../apis/postApi";
import {
  Skeleton,
  Typography,
  Box,
  Alert,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

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

  const renderSkeletons = (count = 3) => {
    return [...Array(count)].map((_, i) => (
      <Card key={i} sx={{ mb: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton
            variant="rectangular"
            height={40}
            sx={{ mt: 1, borderRadius: 2 }}
          />
          <Skeleton variant="text" width="100%" />
        </CardContent>
      </Card>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Loading posts... It may take around 15 seconds to start the backend if
          it's been idle.
        </Typography>
        <Stack spacing={4}>{renderSkeletons(3)}</Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ py: 1, fontSize: "1rem" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return <PostList posts={posts} />;
}
