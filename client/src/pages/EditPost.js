import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../api";
import { Box, Typography, Paper } from "@mui/material";
import PostForm from "../components/PostForm";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(id);
        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdatePost = async ({ title, content }) => {
    try {
      await updatePost(id, { title, content });
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
      <Typography variant="h5" fontWeight="600" mb={3} color="primary">
        Edit a Post
      </Typography>
      <Paper sx={{ p: 3, cursor: "pointer", "&:hover": { boxShadow: 8 } }}>
        <PostForm
          buttonText="Update Post"
          onSubmit={handleUpdatePost}
          initialTitle={title}
          initialContent={content}
        />
      </Paper>
    </Box>
  );
}
