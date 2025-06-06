import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../apis/postApi";
import { Card, Typography, CardContent, Alert } from "@mui/material";
import PostForm from "../components/PostForm";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(id);
        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to fetch post.");
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
      setError("Failed to update post: " + error);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{ p: 2, "&:hover": { boxShadow: 8 }, gap: 3 }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight="600" mb={4} color="primary">
            Edit Post
          </Typography>
          <PostForm
            buttonText="Submit"
            onSubmit={handleUpdatePost}
            initialTitle={title}
            initialContent={content}
          />
        </CardContent>
        {error && <Alert severity="error">{error}</Alert>}{" "}
      </Card>
    </>
  );
}
