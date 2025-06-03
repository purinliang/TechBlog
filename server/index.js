const express = require('express');
const cors = require('cors');
const app = express();
const postRoutes = require('./routes/postRoutes');

app.use(cors());
app.use(express.json());
app.use('/posts', postRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
