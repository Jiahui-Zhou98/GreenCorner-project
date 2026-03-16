import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../db/connection.js";

const router = express.Router();

// GET /api/plant-listings
// Query params: plantType, listingType, condition, status, minPrice, maxPrice, page, limit
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("plantListings");

    const {
      plantType,
      listingType,
      condition,
      status,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (plantType) filter.plantType = plantType;
    if (listingType) filter.listingType = listingType;
    if (condition) filter.condition = condition;
    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (req.query.onlyMyPosts === "true" && req.session.userId) {
      filter.createdBy = req.session.userId;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await collection.countDocuments(filter);
    const listings = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    res.json({
      listings,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/plant-listings/:id
router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("plantListings");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const listing = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/plant-listings
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("plantListings");

    const {
      plantName,
      plantType,
      description,
      condition,
      listingType,
      price,
      location,
      sellerName,
      sellerEmail,
      tags,
      imageUrl,
    } = req.body;

    if (!plantName || !plantType || !listingType || !location || !sellerName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!req.session.userId) {
      return res
        .status(401)
        .json({ error: "You must be logged in to create a listing." });
    }

    const newListing = {
      plantName,
      plantType,
      description: description || "",
      condition: condition || "good",
      listingType,
      price: listingType === "free" ? 0 : Number(price) || 0,
      location,
      status: "available",
      sellerName,
      sellerEmail: sellerEmail || "",
      tags: tags || [],
      imageUrl: imageUrl || null,
      createdBy: req.session.userId,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newListing);
    res.status(201).json({ ...newListing, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/plant-listings/:id
router.put("/:id", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res
        .status(401)
        .json({ error: "You must be logged in to edit a listing." });
    }

    const db = await connectDB();
    const collection = db.collection("plantListings");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const existing = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!existing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (existing.createdBy !== req.session.userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own listings." });
    }

    const allowedFields = [
      "plantName",
      "plantType",
      "description",
      "condition",
      "listingType",
      "price",
      "location",
      "status",
      "sellerName",
      "sellerEmail",
      "tags",
      "imageUrl",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.listingType === "free") updates.price = 0;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/plant-listings/:id
router.delete("/:id", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res
        .status(401)
        .json({ error: "You must be logged in to delete a listing." });
    }

    const db = await connectDB();
    const collection = db.collection("plantListings");

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const existing = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!existing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (existing.createdBy !== req.session.userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own listings." });
    }

    await collection.deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
