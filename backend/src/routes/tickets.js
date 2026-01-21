// // backend/src/routes/tickets.js
// const express = require('express');
// const router = express.Router();
// const Ticket = require('../models/Ticket'); // Πάμε ένα φάκελο πίσω (..) για να βρούμε τα models

// // 1. Δημιουργία Ticket (POST)
// router.post('/', async (req, res) => {
//     try {
//         const newTicket = new Ticket(req.body);
//         const savedTicket = await newTicket.save();
//         res.status(201).json(savedTicket);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // 2. Λήψη όλων των Tickets (GET)
// router.get('/', async (req, res) => {
//     try {
//         const tickets = await Ticket.find().sort({ createdAt: -1 });
//         res.json(tickets);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// module.exports = router;

const express = require("express");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");
const router = express.Router();

/**
 * GET /api/tickets
 * Επιστρέφει όλα τα tickets (τελευταία πρώτα)
 */
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.status(200).json({
      tickets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Σφάλμα κατά την ανάκτηση tickets.",
    });
  }
});

const mongoose = require("mongoose");

// GET ticket by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * POST /api/tickets
 * Δημιουργία νέου ticket
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, category, priority, description } = req.body;

    // Απλός έλεγχος
    if (!name || !email || !subject || !category || !priority || !description) {
      return res.status(400).json({
        message: "Όλα τα πεδία είναι υποχρεωτικά.",
      });
    }

    const ticket = new Ticket({
      name,
      email,
      subject,
      category,
      priority,
      description,
    });

    const savedTicket = await ticket.save();

    res.status(201).json({
      message: "Το ticket δημιουργήθηκε επιτυχώς.",
      ticket: savedTicket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Σφάλμα κατά τη δημιουργία ticket.",
    });
  }
});

module.exports = router;
