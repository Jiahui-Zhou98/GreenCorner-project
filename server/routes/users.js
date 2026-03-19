import express from "express";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";
import { connectDB } from "../db/connection.js";

const router = express.Router();

const SALT_ROUNDS = 10;

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

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
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
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Invalid email or password." });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    });
  })(req, res, next);
});

// GET /api/users/me
router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not logged in." });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

// POST /api/users/logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out." });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out." });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully." });
    });
  });
});

export default router;
