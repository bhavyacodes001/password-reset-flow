/**
 * routes/auth.js - Authentication & Password Reset Routes
 * 
 * Handles all auth-related endpoints:
 *   POST /register       - Create a new user account
 *   POST /login          - Authenticate and log in
 *   PUT  /profile        - Update user profile (name)
 *   POST /change-password - Change password while logged in
 *   POST /forgot-password - Request a password reset email
 *   GET  /reset-password/:token  - Verify reset token validity
 *   POST /reset-password/:token  - Set new password using token
 */

const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const sendResetEmail = require("../utils/sendEmail");

const router = express.Router();

// Health check for the auth routes
router.get("/health", (req, res) => {
  res.json({ status: "Auth routes working" });
});

/**
 * POST /api/auth/register
 * Creates a new user account with hashed password.
 * Returns the user object for immediate auto-login.
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // Password is auto-hashed by the User model's pre-save hook
    const user = await User.create({ name: name || "", email, password });

    res.status(201).json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

/**
 * POST /api/auth/login
 * Authenticates user by comparing the provided password
 * with the hashed password stored in the database.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare plain-text password with hashed password in DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

/**
 * PUT /api/auth/profile
 * Updates the user's display name.
 */
router.put("/profile", async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

/**
 * POST /api/auth/change-password
 * Allows a logged-in user to change their password by
 * verifying the current password first.
 */
router.post("/change-password", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password before allowing change
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // New password will be auto-hashed by the pre-save hook
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

/**
 * POST /api/auth/forgot-password
 * 
 * Core password reset flow - Step 1:
 * 1. Check if user exists in DB by email
 * 2. Generate a cryptographically random 64-char hex token
 * 3. Store the token + 15-minute expiry in the user's document
 * 4. Send an email with the reset link containing the token
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Step 1: Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    // Step 2: Generate a random token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Step 3: Store token with 15-minute expiry in DB
    const tokenExpiry = Date.now() + 15 * 60 * 1000;
    user.resetToken = resetToken;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    // Step 4: Send the reset email with the token link (with 15s timeout)
    const emailPromise = sendResetEmail(user.email, resetToken);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timed out")), 15000)
    );

    try {
      await Promise.race([emailPromise, timeoutPromise]);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      return res.status(500).json({
        message: "Failed to send reset email. Please try again in a moment.",
      });
    }

    res.json({ message: "Password reset link has been sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

/**
 * GET /api/auth/reset-password/:token
 * 
 * Core password reset flow - Step 2:
 * Verifies that the token exists in DB and has not expired.
 * Called when the user clicks the reset link from their email.
 */
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link. Please request a new one.",
      });
    }

    res.json({ message: "Token is valid", email: user.email });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

/**
 * POST /api/auth/reset-password/:token
 * 
 * Core password reset flow - Step 3:
 * 1. Verify token is still valid and not expired
 * 2. Update the user's password (auto-hashed by pre-save hook)
 * 3. Clear the reset token and expiry from DB (one-time use)
 */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Step 1: Verify the token is valid and not expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link. Please request a new one.",
      });
    }

    // Step 2: Set the new password (hashed automatically)
    user.password = password;

    // Step 3: Clear the token so it can't be reused
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
