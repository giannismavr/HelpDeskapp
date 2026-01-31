const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// GET /api/users  (admin only) - list users
router.get("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/users (admin only) - create user/agent/admin
router.post("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: "missing fields" });
    if (!["user", "agent", "admin"].includes(role)) return res.status(400).json({ message: "invalid role" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, role, name: name || "" });

    res.status(201).json({ user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PATCH /api/users/:id/role (admin only) - change role
router.patch("/:id/role", auth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!["user", "agent", "admin"].includes(role)) {
      return res.status(400).json({ message: "invalid role" });
    }

    // (προαιρετικό) μην αφήσεις να αλλάξει ο admin τον εαυτό του σε user κατά λάθος
    if (req.user.id === id && role !== "admin") {
      return res.status(400).json({ message: "You cannot remove your own admin role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, projection: { passwordHash: 0 } }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DELETE /api/users/:id (admin only)
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (req.user.id === id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PATCH /api/users/:id/password (admin only) - reset password
router.patch("/:id/password", auth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 chars" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const user = await User.findByIdAndUpdate(
      id,
      { passwordHash },
      { new: true, projection: { passwordHash: 0 } }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Password reset", user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


module.exports = router;
