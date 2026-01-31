const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
    name: { type: String, default: "" }, // προαιρετικό
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
