import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AnimeOfTheDayCard({ featured = false }) {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE = import.meta.env.VITE_API_URL ?? "";

  useEffect(() => {
    axios
      .get(`${BASE}/api/anime-of-the-day`)
      .then((res) => setAnime(res.data))
      .catch(() => setError("Could not load anime of the day."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return featured ? (
      <div className="aotd-featured">
        <div className="skeleton aotd-featured-skeleton" />
      </div>
    ) : (
      <div className="aotd-card panel">
        <div className="skeleton aotd-skeleton-img" />
        <div className="aotd-body">
          <div className="skeleton skeleton-line skeleton-line--title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line--short" />
        </div>
      </div>
    );
  }

  if (error || !anime) return null;

  const synopsis = anime.synopsis
    ? anime.synopsis.slice(0, 220) + (anime.synopsis.length > 220 ? "…" : "")
    : "No synopsis available.";

  if (featured) {
    return (
      <Link to={`/anime/${anime.mal_id}`} className="aotd-featured-link">
        <div className="aotd-featured">
          <img
            src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
            alt={anime.title}
            className="aotd-featured-img"
          />
          <div className="aotd-featured-overlay">
            <span className="aotd-featured-label">Anime of the Day</span>
            <h2 className="aotd-featured-title">{anime.title}</h2>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="aotd-card panel">
      <div className="aotd-badge">
        <span className="dot" />
        Anime of the Day
      </div>
      <img
        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
        alt={anime.title}
        className="aotd-img"
      />
      <div className="aotd-body">
        <h2 className="aotd-title">{anime.title}</h2>
        {anime.score && (
          <span className="badge aotd-score">★ {anime.score}</span>
        )}
        <p className="aotd-synopsis meta">{synopsis}</p>
        <Link to={`/anime/${anime.mal_id}`} className="aotd-link">
          <button>View Details</button>
        </Link>
      </div>
    </div>
  );
}
