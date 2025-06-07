import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

export default function UserStatus() {
  const { username, setUsername } = useUser();
  const localUsername = localStorage.getItem("username");
  setUsername(localUsername);
  const navigate = useNavigate();

  const handleClick = () => {
    if (username) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUsername(null);
    } else {
      navigate("/auth");
    }
  };

  return (
    <Box display="flex" alignItems="center">
      {username && (
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          {`Welcome, ${username}`}
        </Typography>
      )}
      <Button variant="outlined" onClick={handleClick} color="inherit">
        {username ? "Logout" : "Login / Register"}
      </Button>
    </Box>
  );
}
