import PostForm from "../components/PostForm";
import { Card, CardHeader, CardContent, Alert } from "@mui/material";
import { createPost } from "../apis/postApi";
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
      setError("Failed to creat post: " + error);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{ p: 2, "&:hover": { boxShadow: 8 }, gap: 3 }}
      >
        <CardHeader title="Create a New Post" />
        <CardContent>
          <PostForm buttonText="Submit" onSubmit={handleCreatePost} />
        </CardContent>
        {error && <Alert severity="error">{error}</Alert>}{" "}
      </Card>
    </>
  );
}
