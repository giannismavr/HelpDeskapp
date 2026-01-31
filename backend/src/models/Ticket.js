
const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Hardware", "Software", "Network", "Billing", "Other"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    comments: [
      {
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        authorRole: { type: String, enum: ["user", "agent", "admin"], required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

  },
  {timestamps: true,}
);

module.exports = mongoose.model("Ticket", TicketSchema);


