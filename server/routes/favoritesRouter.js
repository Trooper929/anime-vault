// console.log("ROUTER LOADED FROM:", __filename);

const express = require("express");
const Favorite = require("../models/Favorite");

const router = express.Router();

/**
 * GET /api/favorites?userKey=abc123
 */
router.get("/", async (req, res) => {
  try {
    const { userKey } = req.query;
    if (!userKey)
      return res.status(400).json({ message: "userKey is required" });

    const favorites = await Favorite.find({ userKey }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/favorites
 * body: { userKey, mal_id, title, imageUrl, score }
 */
router.post("/", async (req, res) => {
  try {
    const { userKey, mal_id, title, imageUrl, score } = req.body;

    if (!userKey || !mal_id || !title) {
      return res
        .status(400)
        .json({ message: "userKey, mal_id, and title are required" });
    }

    const created = await Favorite.create({
      userKey,
      mal_id,
      title,
      imageUrl: imageUrl || "",
      score: typeof score === "number" ? score : null,
    });

    res.status(201).json(created);
  } catch (err) {
    // Duplicate favorite (unique index) -> send friendly message
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already in favorites" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * PUT /api/favorites/:id
 * body: { status?, notes? }
 */
router.put("/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;

    const updated = await Favorite.findByIdAndUpdate(
      req.params.id,
      {
        ...(status !== undefined ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
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

/**
 * DELETE /api/favorites/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Favorite.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Favorite not found" });
    res.json({ ok: true, deletedId: deleted._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
