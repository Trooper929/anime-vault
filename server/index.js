const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();
require("./db");

const favoritesRouter = require("./routes/favoritesRouter");
const authRouter = require("./routes/authRouter");
const animeOfTheDayRouter = require("./routes/animeOfTheDayRouter");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://theanimevault.onrender.com",
    "https://theanimevault-app.onrender.com",
    "https://animevault.onrender.com",
  ],
}));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/anime-of-the-day", animeOfTheDayRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Anime Vault API alive" });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
