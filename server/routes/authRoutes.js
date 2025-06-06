const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET_KEY;

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create(username, hashedPassword);

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET,
      { expiresIn: "30min" }
    );
    console.log(user);
    res.status(201).json({
      message: "Registration successful",
      token,
      username: user.username,
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    const user = await UserModel.getByUsername(username);
    if (!user) return res.status(401).json({ message: "User not found" });

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
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
