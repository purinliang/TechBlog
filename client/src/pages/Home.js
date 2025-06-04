import PostList from "../components/PostList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Home() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
      <Typography variant="h5" fontWeight="600" mb={2} color="primary">
        Post List
      </Typography>
      <PostList />
    </Box>
  );
}
