import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../UserContext";

export default function UserStatus() {
  const { username, setUsername } = useUser();
  const localUsername = localStorage.getItem("username");
  setUsername(localUsername);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (username) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUsername(null);
      window.location.reload();
    } else {
      navigate("/auth", { state: { from: location.pathname } });
    }
  };

  const shortUsername =
    username && username.length >= 10 ? `${username.slice(0, 8)}...` : username;

  return (
    <Box display="flex" alignItems="center">
      {username && (
        <>
          <Typography
            variant="body1"
            sx={{
              marginRight: 2,
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            {`Welcome, ${username}`}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              marginRight: 2,
              display: {
                xs: "block",
                sm: "none",
              },
            }}
          >
            {shortUsername}
          </Typography>
        </>
      )}
      <Button variant="outlined" onClick={handleClick} color="inherit">
        {username ? "Logout" : "Login / Register"}
      </Button>
    </Box>
  );
}
