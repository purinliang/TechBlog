import PostList from "../components/PostList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="600" color="primary">
          Post List
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/auth")}>
          Login / Register
        </Button>
      </Box>
      <PostList />
    </Box>
  );
}
