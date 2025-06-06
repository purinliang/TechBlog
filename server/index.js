require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

const { connectDatabase } = require("./database/db");

app.use(cors());
app.use(express.json());
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);

connectDatabase();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
