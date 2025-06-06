import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, deletePost } from "../apis/postApi";
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
import ReactMarkdown from "react-markdown";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

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
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteError("Failed to delete the post: " + error);
    }
  };

  const handleConfirmDelete = () => {
    handleDelete();
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
    <>
      <Card
        variant="outlined"
        sx={{ maxWidth: 1000, p: 2, "&:hover": { boxShadow: 8 } }}
      >
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom color="primary">
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            By {post.author_username || "Unknown"}
          </Typography>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </CardContent>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/edit_post/${id}`)}
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

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          sx={{ p: 4 }}
        >
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
          {deleteError && <Alert severity="error">{deleteError}</Alert>}
        </Dialog>
      </Card>
    </>
  );
}
