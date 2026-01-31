// backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

// Εισαγωγή των Routes
const ticketRoutes = require("./routes/tickets");
const authRoutes = require("./routes/auth");
const usersRouter = require("./routes/users");

const app = express();
const PORT = 5001;


// Middleware
app.use(cors());
app.use(express.json());

// --- ΣΥΝΔΕΣΗ ΜΕ LOCAL MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to Local MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));


// Χρήση Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", usersRouter);


app.get('/', (req, res) => {
    res.send('HelpDesk API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


