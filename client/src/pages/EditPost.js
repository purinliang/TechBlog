import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../api";
import { Box, TextField, Button } from "@mui/material";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, { title, content });
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <TextField
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Content"
        variant="outlined"
        multiline
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        fullWidth
      />
      <Button variant="contained" type="submit" size="large">
        Update Post
      </Button>
    </Box>
  );
}
