const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// ============================
// REGISTER (JWT EMAIL VERIFY)
// ============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      emailVerified: false, // ✅ SINGLE SOURCE OF TRUTH
    });

    // JWT email verification token
    const emailToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email/${emailToken}`;

    // Email sending should NOT block registration
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your WORKZO account",
        html: `
          <h2>Welcome to WORKZO</h2>
          <p>Please verify your email:</p>
          <a href="${verifyUrl}">Verify Email</a>
        `,
      });
    } catch (err) {
      console.error("EMAIL SEND FAILED:", err.message);
    }

    return res.status(201).json({
      message:
        "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    return res
      .status(500)
      .json({ message: "Registration failed" });
  }
};

// ============================
// VERIFY EMAIL (JWT)
// ============================
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params; // ✅ FIXED

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect(
        "http://localhost:5173/verify-email?status=failed"
      );
    }

    // ✅ CORRECT FIELD
    user.emailVerified = true;
    await user.save();

    return res.redirect(
      "http://localhost:5173/verify-email?status=success"
    );
  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err.message);
    return res.redirect(
      "http://localhost:5173/verify-email?status=failed"
    );
  }
};

// ============================
// RESEND EMAIL VERIFICATION
// ============================
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const emailToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email/${emailToken}`;

    await sendEmail({
      to: user.email,
      subject: "Resend: Verify your WORKZO account",
      html: `
        <h2>Email Verification</h2>
        <p>Please verify your email:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });

    return res.json({
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.error(
      "RESEND EMAIL ERROR:",
      error.message
    );
    return res.status(500).json({
      message:
        "Failed to resend verification email",
    });
  }
};

// ============================
// LOGIN (BLOCK IF NOT VERIFIED)
// ============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res
      .status(500)
      .json({ message: "Login failed" });
  }
};

// ============================
// EXPORTS
// ============================
module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
};
