const express = require("express");
const Ticket = require("../models/Ticket");
const router = express.Router();

const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const { sendEmail } = require("../utils/mailer");
const User = require("../models/User");


const mongoose = require("mongoose");

// GET /api/tickets
router.get("/", auth, async (req, res) => {
  try {
    const filter = req.user.role === "user" ? { createdBy: req.user.id } : {};
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ tickets });
  } catch (e) {
    return res.status(500).json({ message: "Σφάλμα κατά την ανάκτηση tickets." });
  }
});


/**
 * GET /api/tickets/:id
 * user: μόνο αν είναι owner
 * agent/admin: ok
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (req.user.role === "user" && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(ticket);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});


// POST /api/tickets
// user: δημιουργεί μόνο για τον εαυτό του
// agent/admin: μπορεί να δημιουργήσει για άλλον user με createdBy στο body
router.post("/", auth, requireRole("user", "agent", "admin"), async (req, res) => {
  try {
    const { name, email, subject, category, priority, description, createdBy } = req.body;

    if (!name || !email || !subject || !category || !priority || !description) {
      return res.status(400).json({ message: "Όλα τα πεδία είναι υποχρεωτικά." });
    }

    // default owner: logged-in user
    let ownerId = req.user.id;

    // agent/admin can set createdBy
    if ((req.user.role === "agent" || req.user.role === "admin") && createdBy) {
      if (!mongoose.Types.ObjectId.isValid(createdBy)) {
        return res.status(400).json({ message: "Invalid createdBy user id" });
      }
      ownerId = createdBy;
    }

    const ticket = await Ticket.create({
      name,
      email,
      subject,
      category,
      priority,
      description,
      createdBy: ownerId,
      status: "Pending",
      comments: [],
    });

    // Στείλε ενημέρωση στον χρήστη (στο ticket.email)
    sendEmail({
      to: ticket.email,
      subject: `Ticket created: ${ticket.subject}`,
      text:
        `Το ticket σου δημιουργήθηκε.\n` +
        `ID: ${ticket._id}\n` +
        `Status: ${ticket.status}\n` +
        `Priority: ${ticket.priority}\n` +
        `Category: ${ticket.category}\n` +
        `Περιγραφή:\n${ticket.description}\n`,
    }).catch((err) => console.log("mail create ticket error:", err.message));

    return res.status(201).json({ message: "Το ticket δημιουργήθηκε επιτυχώς.", ticket });
  } catch (e) {
    return res.status(500).json({ message: "Σφάλμα κατά τη δημιουργία ticket." });
  }
});



// DELETE /api/tickets/:id
// μόνο agent/admin
router.delete("/:id", auth, requireRole("agent", "admin"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const deleted = await Ticket.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Ticket not found" });

    return res.json({ message: "Ticket deleted" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});


/**
 * PATCH /api/tickets/:id/status
 * μόνο agent/admin
 */
router.patch("/:id/status", auth, requireRole("agent", "admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    sendEmail({
      to: ticket.email,
      subject: `Ticket update: ${ticket.subject}`,
      text: `Η κατάσταση του ticket (${ticket._id}) άλλαξε σε: ${ticket.status}`+
            `Περιγραφή:\n${ticket.description}\n`,
    }).catch((err) => console.log("mail status error:", err.message));

    return res.json(ticket);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

/**
 * PATCH /api/tickets/:id/priority
 * μόνο agent/admin
 */
router.patch("/:id/priority", auth, requireRole("agent", "admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const ticket = await Ticket.findByIdAndUpdate(id, { priority }, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    return res.json(ticket);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// PATCH /api/tickets/:id
// user: μόνο owner & μόνο αν Pending
// agent/admin: ok
router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, category, priority, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const isUser = req.user.role === "user";
    const isOwner = ticket.createdBy.toString() === req.user.id;

    if (isUser) {
      if (!isOwner) return res.status(403).json({ message: "Forbidden" });
      if (ticket.status !== "Pending") {
        return res.status(400).json({ message: "Ticket can only be edited while Pending" });
      }
    }

    if (req.user.role === "user") {
      if (priority !== undefined) {
        return res.status(403).json({ message: "Users cannot change priority" });
      }
    }

    // validations (light)
    if (category && !["Hardware", "Software", "Network", "Billing", "Other"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (priority && !["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    if (subject !== undefined) ticket.subject = subject;
    if (category !== undefined) ticket.category = category;
    if (priority !== undefined) ticket.priority = priority;
    if (description !== undefined) ticket.description = description;

    await ticket.save();
    return res.json(ticket);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});


/**
 * POST /api/tickets/:id/comments
 * user: μόνο στα δικά του
 * agent/admin: σε όλα
 */
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (req.user.role === "user" && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    ticket.comments.push({
      authorId: req.user.id,
      authorRole: req.user.role,
      message: message.trim(),
    });

    await ticket.save();

    try {
      // owner user (createdBy)
      const owner = await User.findById(ticket.createdBy);

      // Αν σχολιάζει agent/admin → ενημέρωσε τον owner
      // Αν σχολιάζει user → ενημέρωσε agents/admin (απλά στέλνουμε σε όλους τους agent/admin)
      if (req.user.role === "user") {
        const staff = await User.find({ role: { $in: ["agent", "admin"] } }, { email: 1, name: 1 });

        const to = staff.map((u) => u.email).filter(Boolean).join(",");
        if (to) {
          sendEmail({
            to,
            subject: `New comment on ticket: ${ticket.subject}`,
            text:
              `Ο χρήστης (${req.user.email}) πρόσθεσε σχόλιο στο ticket ${ticket._id}\n\n` +
              `Μήνυμα:\n${message.trim()}\n`,
          }).catch((err) => console.log("mail comment(user->staff) error:", err.message));
        }
      } else {
        if (owner?.email) {
          sendEmail({
            to: owner.email,
            subject: `New comment on your ticket: ${ticket.subject}`,
            text:
              `Υπάρχει νέο σχόλιο στο ticket ${ticket._id}\n` +
              `Από: ${req.user.role} (${req.user.email})\n\n` +
              `Μήνυμα:\n${message.trim()}\n`,
          }).catch((err) => console.log("mail comment(staff->user) error:", err.message));
        }
      }
    } catch (e) {
      console.log("mail comment error:", e.message);
    }

    return res.json(ticket);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
