/**
 * config.js - Central configuration for API URL
 * 
 * Uses environment variable REACT_APP_API_URL if set (for production),
 * otherwise falls back to localhost for development.
 */
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api/auth";

export default API_URL;
