// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // Using 5001 to avoid conflicts with React's default 3000

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/codeforces', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- MODIFIED LINE ---
// Using a standard /api prefix for all student routes
const studentRouter = require('./routes/students');
app.use('/api/students', studentRouter); 

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
