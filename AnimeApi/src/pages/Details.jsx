import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeById } from "../services/jikanApi";
import { FavoritesContext } from "../context/FavoritesContext.jsx";
import SkeletonCard from "../components/SkeletonCard";

export default function Details() {
  const { id } = useParams();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { favorites, addFavorite, deleteFavorite } =
    useContext(FavoritesContext);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAnimeById(id)
      .then((res) => setAnime(res.data.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="details">
        <div className="panel details-skeleton">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="details">
        <div className="panel">
          <p>Something went wrong loading this anime. Try again.</p>
        </div>
      </div>
    );

  if (!anime)
    return (
      <div className="details">
        <div className="panel">
          <p>Not found.</p>
        </div>
      </div>
    );

  const existingFav = favorites.find((f) => f.mal_id === anime.mal_id);
  const isSaved = Boolean(existingFav);

  function toggleFavorite() {
    if (isSaved) deleteFavorite(existingFav._id);
    else addFavorite(anime);
  }

  async function handleShare() {
    const shareData = {
      title: anime.title,
      text: `Check out ${anime.title} — you should watch this!`,
      url: window.location.href,
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }

  return (
    <div className="details">
      <div className="panel">
        <div className="details-layout">
          <img
            src={
              anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
            }
            alt={anime.title}
            className="details-img"
          />
          <div className="details-body">
            <h1>{anime.title}</h1>
            <div className="details-meta">
              {anime.score && <span className="badge">★ {anime.score} MAL Score</span>}
              {anime.status && <span className="badge">{anime.status}</span>}
              {anime.episodes && (
                <span className="badge">{anime.episodes} eps</span>
              )}
            </div>
            <div className="details-actions">
              <button onClick={toggleFavorite}>
                {isSaved ? "★ Remove from Vault" : "☆ Save to Vault"}
              </button>
              <button className="btn-secondary" onClick={handleShare}>
                Share
              </button>
            </div>
            <p className="details-synopsis">
              {anime.synopsis || "No synopsis available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
