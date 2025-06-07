// server/index.js
const validateEnv = require("./validateEnv");
validateEnv(); // Validate environment variables before starting the server

const { connectDatabase } = require("./database/db");
connectDatabase();

const cors = require("cors");
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/likes", likeRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
