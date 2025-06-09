// client/src/components/PostDetail.js
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, deletePost } from "../apis/postApi";
import PostMeta from "../components/PostMeta";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Link,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import CommentList from "../components/CommentList";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);

        // let count = 0;
        // let liked = false;
        // const token = localStorage.getItem("token");

        // if (token) {
        //   const likeStatus = await getLikeStatus(id);
        //   count = Number(likeStatus.count) || 0;
        //   liked = !!likeStatus.likedByCurrentUser;
        // } else {
        //   const likeRes = await getLikeCount(id);
        //   count = Number(likeRes.likes) || 0;
        // }

        // setPost({ ...fetchedPost, likeCount: count, liked });
        const username = localStorage.getItem("username");
        if (fetchedPost?.author_username && username) {
          setIsAuthor(fetchedPost.author_username === username);
        }
      } catch (error) {
        // TODO: ignore token expired error
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
          <Typography
            variant="h4"
            color="primary"
            fontWeight="600"
            gutterBottom
          >
            {post.title}
          </Typography>
          <ReactMarkdown>{post.content}</ReactMarkdown>
          <PostMeta
            author={post.author_username}
            createdAt={post.created_at}
            postId={id}
            initialLikeCount={post.like_count}
            initiallyLiked={post.liked_by_user}
          />

          {isAuthor && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography color="text.secondary" gutterBottom>
                  You are the author, you can:
                </Typography>
                <Link
                  variant="text"
                  color="primary"
                  onClick={() => navigate(`/editpost/${id}`)}
                  disableRipple
                  sx={{
                    textTransform: "none",
                    textDecoration: "underline",
                    "&:hover": {
                      textDecoration: "underline",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Edit
                </Link>
                <Typography color="text.secondary" gutterBottom>
                  or
                </Typography>
                <Link
                  variant="text"
                  color="error"
                  onClick={() => setOpenDialog(true)}
                  disableRipple
                  sx={{
                    textTransform: "none",
                    textDecoration: "underline",
                    "&:hover": {
                      textDecoration: "underline",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Delete
                </Link>
              </Box>
            </Box>
          )}
        </CardContent>

        <CommentList postId={id} />
        {commentError && <Alert severity="error">{commentError}</Alert>}

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
