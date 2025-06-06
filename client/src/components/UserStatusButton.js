import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function UserStatusButton() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser);
  }, []);

  const handleClick = () => {
    if (username) {
      navigate("/auth");
    } else {
      navigate("/auth");
    }
  };

  return (
    <Button variant="outlined" onClick={handleClick} color="inherit">
      {username ? username : "Login"}
    </Button>
  );
}
