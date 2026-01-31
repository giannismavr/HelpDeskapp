require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
    console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in backend/.env");
    process.exit(1);
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    console.log("ℹ️ Admin already exists:", exists.email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await User.create({
    email,
    passwordHash,
    role: "admin",
    name: "Admin",
  });

  console.log("✅ Admin created:", admin.email);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
