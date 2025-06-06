const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET_KEY;

function isValidUsername(username) {
  return /^[a-zA-Z0-9_]{6,20}$/.test(username);
}

function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/.test(password);
}

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  if (!isValidUsername(username))
    return res.status(400).json({ message: "Invalid username format" });

  if (!isValidPassword(password))
    return res.status(400).json({
      message:
        "Password must be at least 6 characters and include letters and numbers",
    });

  try {
    const existingUser = await UserModel.getByUsername(username);
    if (existingUser)
      return res.status(409).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create(username, hashedPassword);

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET,
      { expiresIn: "30min" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      username: user.username,
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  if (!isValidUsername(username) || !isValidPassword(password))
    return res.status(400).json({ message: "Invalid credentials format" });

  try {
    const user = await UserModel.getByUsername(username);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET,
      { expiresIn: "30min" }
    );

    res.json({ message: "Login successful", token, username: user.username });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
