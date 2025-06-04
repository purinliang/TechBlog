const express = require("express");
const cors = require("cors");
const app = express();
const postRoutes = require("./routes/postRoutes");

app.use(cors());
app.use(express.json());
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
