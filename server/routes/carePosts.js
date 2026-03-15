import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../db/connection.js";

const router = express.Router();

// GET /api/careposts
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("carePosts");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const { plantType, difficulty, light, onlyMyPosts } = req.query;

    const filter = {};
    if (plantType) filter.plantType = plantType;
    if (difficulty) filter.difficulty = difficulty;
    if (light) filter.light = light;
    if (onlyMyPosts === "true" && req.session.userId) {
      filter.createdBy = req.session.userId;
    }

    const skip = (page - 1) * limit;
    const total = await collection.countDocuments(filter);
    const posts = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      posts,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/careposts/:id
router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("carePosts");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/careposts
router.post("/", async (req, res) => {
  try {
    // 1. Authenticate user session
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    const db = await connectDB();
    const collection = db.collection("carePosts");

    const {
      title,
      plantType,
      difficulty,
      light,
      watering,
      content,
      author,
      imageUrl,
    } = req.body;

    if (!title || !plantType || !content || !author) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPost = {
      title,
      plantType,
      difficulty: difficulty || "easy",
      light: light || "",
      watering: watering || "",
      content,
      author,
      imageUrl: imageUrl || null,
      createdBy: req.session.userId, // Link post to the logged-in user ID
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newPost);
    res.status(201).json({ ...newPost, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/careposts/:id
router.put("/:id", async (req, res) => {
  try {
    // 1. Authenticate user session
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    const db = await connectDB();
    const collection = db.collection("carePosts");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // 2. Fetch existing post to check ownership
    const existing = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!existing) return res.status(404).json({ error: "Post not found" });

    // 3. Authorize: Compare session ID with post creator ID
    if (existing.createdBy !== req.session.userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not own this post." });
    }

    const allowedFields = [
      "title",
      "plantType",
      "difficulty",
      "light",
      "watering",
      "content",
      "author",
      "imageUrl",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    res.json(result.value || result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/careposts/:id
router.delete("/:id", async (req, res) => {
  try {
    // 1. Authenticate user session
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    const db = await connectDB();
    const collection = db.collection("carePosts");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // 2. Fetch existing post to check ownership
    const existing = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!existing) return res.status(404).json({ error: "Post not found" });

    // 3. Authorize: Only the creator can delete
    if (existing.createdBy !== req.session.userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not own this post." });
    }

    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
