import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../db/connection.js";

const router = express.Router();


// GET /api/careposts
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("carePosts");

    const posts = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(posts);
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

    const post = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /api/careposts
router.post("/", async (req, res) => {
  try {
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
    const db = await connectDB();
    const collection = db.collection("carePosts");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
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
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE /api/careposts/:id
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("carePosts");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;