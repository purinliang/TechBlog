import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, deletePost } from "../api";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (!post) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 700, margin: "20px auto", p: 2 }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom color="primary">
          {post.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", color: "text.primary" }}
        >
          {post.content}
        </Typography>
      </CardContent>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(`/edit/${id}`)}
        sx={{ mr: 2 }}
      >
        Edit
      </Button>
      <Button variant="outlined" color="error" onClick={handleDelete}>
        Delete
      </Button>
    </Card>
  );
}
