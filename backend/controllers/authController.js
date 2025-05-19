// backend/controllers/authController.js
import User from "../models/User.js";

export const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  try {
    const user = await User.findOne({ name });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid name or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const signup = async (req, res) => {
  const { name, password } = req.body;

  try {
    const existing = await User.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, password }); // 🔒 use bcrypt in production
    await user.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};
