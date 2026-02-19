/**
 * models/User.js - Mongoose User Schema
 * 
 * Defines the User model with fields for authentication
 * and password reset functionality. Passwords are automatically
 * hashed using bcrypt before being saved to the database.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    // Stores the randomly generated token for password reset
    resetToken: {
      type: String,
      default: null,
    },
    // Stores the expiry timestamp (15 min) for the reset token
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: Hash the password with bcrypt (12 salt rounds)
 * only when the password field has been modified.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method: Compare a plain-text password with the
 * stored hashed password using bcrypt.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
