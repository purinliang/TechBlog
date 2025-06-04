import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";
import { Box, TextField, Button, Alert } from "@mui/material";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ title, content });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 800,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
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
        rows={8}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        fullWidth
      />
      <Button variant="contained" type="submit" size="large">
        Post
      </Button>
    </Box>
  );
}
