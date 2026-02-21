const mongoose = require("mongoose");
const { Schema } = mongoose;

const favoriteSchema = new Schema(
  {
    userKey: { type: String, required: true, index: true },
    mal_id: { type: Number, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    score: { type: Number, default: null },
    status: { type: String, default: "Planned" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

// Prevent duplicates per user
favoriteSchema.index({ userKey: 1, mal_id: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
