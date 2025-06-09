// server/index.js
require("./utils/validateEnv");
require("./utils/dbClient");
require("./utils/redisClient");

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
  console.log(`🟢 Server is running on port ${PORT}`);
});
