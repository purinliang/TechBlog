import { useState, useEffect } from "react";
import { Box, TextField, Button, Alert } from "@mui/material";

export default function PostForm({
  buttonText = "Submit",
  onSubmit,
  initialTitle = "",
  initialContent = "",
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      try {
        await onSubmit({ title, content });
      } catch (error) {
        console.error("Error submitting post:", error);
        setError("Failed to create or update post.");
      }
    }
  };

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
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
        minRows={8}
        maxRows={16}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        fullWidth
      />
      <Button variant="contained" type="submit" size="large">
        {buttonText}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
