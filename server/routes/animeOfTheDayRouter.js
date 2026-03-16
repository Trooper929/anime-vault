const express = require("express");
const https = require("https");

const router = express.Router();

let cache = { date: null, anime: null };

function fetchFromJikan(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "AnimeVault/1.0" } }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

// GET /api/anime-of-the-day  (no auth required)
router.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    if (cache.date === today && cache.anime) {
      return res.json(cache.anime);
    }

    // Pick a random page (1-3) and random index to get variety
    const page = Math.floor(Math.random() * 3) + 1;
    const json = await fetchFromJikan(
      `https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`,
    );

    const list = json.data;
    if (!list || list.length === 0) {
      return res.status(503).json({ message: "Could not fetch anime" });
    }

    const pick = list[Math.floor(Math.random() * list.length)];
    cache = { date: today, anime: pick };
    res.json(pick);
  } catch (err) {
    res.status(503).json({ message: "Failed to fetch anime of the day", error: err.message });
  }
});

module.exports = router;
