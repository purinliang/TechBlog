import PostForm from "../components/PostForm";
import { Box, Card, CardHeader, CardContent, Alert } from "@mui/material";
import { createPost } from "../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NewPost() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleCreatePost = async ({ title, content }) => {
    try {
      await createPost({ title, content });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to creat post.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
      <Card variant="outlined" sx={{ p: 2, "&:hover": { boxShadow: 8 } }}>
        <CardHeader title="Create a New Post" />
        <CardContent>
          {error && <Alert severity="error">{error}</Alert>}{" "}
          <PostForm buttonText="Submit" onSubmit={handleCreatePost} />
        </CardContent>
      </Card>
    </Box>
  );
}
