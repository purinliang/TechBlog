import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

export default function UserStatusButton() {
  const { username, setUsername } = useUser();
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

  console.log("button:" + username);

  return (
    <Button variant="outlined" onClick={handleClick} color="inherit">
      {username ? `Logout (${username})` : "Login / Register"}
    </Button>
  );
}
