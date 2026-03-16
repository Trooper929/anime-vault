const express = require("express");
const Favorite = require("../models/Favorite");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

// All favorites routes require a valid JWT
router.use(requireAuth);

// GET /api/favorites
router.get("/", async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/favorites
// body: { mal_id, title, imageUrl }
router.post("/", async (req, res) => {
  try {
    const { mal_id, title, imageUrl } = req.body;

    if (!mal_id || !title) {
      return res
        .status(400)
        .json({ message: "mal_id and title are required" });
    }

    const created = await Favorite.create({
      userId: req.userId,
      mal_id,
      title,
      imageUrl: imageUrl || "",
      score: null,
    });

    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already in favorites" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/favorites/:id
// body: { status, score }
router.put("/:id", async (req, res) => {
  try {
    const { status, score } = req.body;

    const updated = await Favorite.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        ...(status !== undefined ? { status } : {}),
        ...(score !== undefined ? { score } : {}),
      },
      { new: true },
    );

    if (!updated)
      return res.status(404).json({ message: "Favorite not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/favorites/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted)
      return res.status(404).json({ message: "Favorite not found" });
    res.json({ ok: true, deletedId: deleted._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
