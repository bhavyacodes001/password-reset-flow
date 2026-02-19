/**
 * server.js - Main entry point for the Password Reset Flow API
 * 
 * Sets up Express server with CORS, JSON parsing, and connects
 * to MongoDB before starting the server.
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware: Allow cross-origin requests from the frontend
app.use(cors({ origin: process.env.CLIENT_URL }));

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// Mount authentication routes under /api/auth
app.use("/api/auth", require("./routes/auth"));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Password Reset API is running" });
});

const PORT = process.env.PORT || 5001;

// Connect to MongoDB, then start the Express server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
