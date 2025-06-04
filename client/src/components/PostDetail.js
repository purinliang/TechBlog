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
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Post not found.");
      } finally {
        setLoading(false);
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

  const handleConfirmDelete = () => {
    handleDelete();
    setOpenDialog(false);
  };

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
      <Button
        variant="outlined"
        color="error"
        onClick={() => setOpenDialog(true)}
      >
        Delete
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
