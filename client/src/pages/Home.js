import PostList from "../components/PostList";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <>
      <Typography variant="h5" fontWeight="600" mb={2} color="primary">
        Post List
      </Typography>
      <PostList />
    </>
  );
}
