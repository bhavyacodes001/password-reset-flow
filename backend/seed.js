const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const seedUser = async () => {
  await connectDB();

  const existingUser = await User.findOne({ email: "testuser@example.com" });
  if (existingUser) {
    console.log("Test user already exists:", existingUser.email);
  } else {
    const user = await User.create({
      email: "testuser@example.com",
      password: "password123",
    });
    console.log("Test user created:", user.email);
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected from DB.");
};

seedUser().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
