// backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Εισαγωγή των Routes (Τώρα είναι στον ίδιο φάκελο src/routes)
const ticketRoutes = require('./routes/tickets');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- ΣΥΝΔΕΣΗ ΜΕ LOCAL MONGODB ---
// (Βεβαιώσου ότι έχεις ανοιχτό το MongoDB Compass και πατάς Connect)
mongoose.connect('mongodb://127.0.0.1:27017/helpdeskDB')
  .then(() => console.log('✅ Connected to Local MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Χρήση Routes
app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => {
    res.send('HelpDesk API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// const ticketRoutes = require("./routes/tickets");
app.use("/api/tickets", ticketRoutes);
