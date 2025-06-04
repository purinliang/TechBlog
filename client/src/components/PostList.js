import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function PostList() {
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {posts.length === 0 ? (
        <Alert severity="info">No posts available.</Alert>
      ) : (
        posts.map((post) => (
          <Card
            key={post.id}
            variant="outlined"
            sx={{ cursor: "pointer", "&:hover": { boxShadow: 6 } }}
          >
            <CardContent>
              <Link to={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight="600"
                  gutterBottom
                >
                  {post.title}
                </Typography>
              </Link>
              <Typography variant="body2" color="text.secondary" noWrap>
                {post.content.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
