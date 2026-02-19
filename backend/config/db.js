/**
 * config/db.js - MongoDB Connection Configuration
 * 
 * Establishes connection to MongoDB Atlas using Mongoose.
 * Exits the process if connection fails.
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
