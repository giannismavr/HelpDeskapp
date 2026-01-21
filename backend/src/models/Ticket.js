// // backend/src/models/Ticket.js
// const mongoose = require('mongoose');

// const ticketSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     priority: { 
//         type: String, 
//         enum: ['Low', 'Medium', 'High'], 
//         default: 'Low' 
//     },
//     status: { 
//         type: String, 
//         enum: ['Open', 'In Progress', 'Resolved'], 
//         default: 'Open' 
//     },
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Ticket', ticketSchema);


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
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", TicketSchema);
