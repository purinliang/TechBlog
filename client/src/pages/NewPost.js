import PostForm from "../components/PostForm";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { createPost } from "../api";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const navigate = useNavigate();

  const handleCreatePost = async ({ title, content }) => {
    try {
      await createPost({ title, content });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
      <Typography variant="h5" fontWeight="600" mb={3} color="primary">
        Create a New Post
      </Typography>
      <Paper sx={{ p: 3, cursor: "pointer", "&:hover": { boxShadow: 8 } }}>
        <PostForm buttonText="Submit" onSubmit={handleCreatePost} />
      </Paper>
    </Box>
  );
}
