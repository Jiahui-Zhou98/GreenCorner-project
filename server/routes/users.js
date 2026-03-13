import express from "express";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { connectDB } from "../db/connection.js";

const router = express.Router();

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      salt,
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    res.status(201).json({
      _id: result.insertedId,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await users.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const hash = hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    req.session.userId = user._id.toString();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/me
router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not logged in." });
    }

    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne(
      { _id: new ObjectId(req.session.userId) },
      { projection: { passwordHash: 0, salt: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out." });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully." });
  });
});

export default router;
