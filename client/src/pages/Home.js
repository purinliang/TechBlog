import PostList from "../components/PostList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h5" fontWeight="600" mb={2} color="primary">
        Post List
      </Typography>
      <PostList />
    </>
  );
}
