import { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../apis/authApi";
import { useUser } from "../UserContext";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const { setUsername } = useUser();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let user;
      if (mode === "register") {
        user = await registerUser({
          username: inputUsername,
          password: inputPassword,
        });
      } else {
        user = await loginUser({
          username: inputUsername,
          password: inputPassword,
        });
      }
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.username);
      setUsername(user.username);
      navigate("/");
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{ p: 2, "&:hover": { boxShadow: 6 }, maxWidth: 600, mx: "auto" }}
    >
      <CardHeader title={mode === "login" ? "Login" : "Register"} />
      <CardContent>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>

        <Box
          component="form"
          onSubmit={handleAuth}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            variant="outlined"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            required
            fullWidth
          />
          <Button variant="contained" type="submit" size="large">
            {mode === "login" ? "Login" : "Register"}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </CardContent>
    </Card>
  );
}
