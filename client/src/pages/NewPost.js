import PostForm from "../components/PostForm";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export default function NewPost() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
      <Typography variant="h5" fontWeight="600" mb={3} color="primary">
        Create a New Post
      </Typography>
      <Paper sx={{ p: 3, cursor: "pointer", "&:hover": { boxShadow: 8 } }}>
        <PostForm />
      </Paper>
    </Box>
  );
}
