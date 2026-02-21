import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeById } from "../services/jikanApi";
import { FavoritesContext } from "../context/FavoritesContext.jsx";

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
      .then((res) => {
        setAnime(res.data.data);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        Monkeys breaking the site from within, working on a fix as we speak.
      </p>
    );
  if (!anime) return <p>Not found.</p>;

  // 🔥 NEW: check if saved
  const existingFav = favorites.find((f) => f.mal_id === anime.mal_id);
  const isSaved = Boolean(existingFav);

  function toggleFavorite() {
    if (isSaved) {
      deleteFavorite(existingFav._id);
    } else {
      addFavorite(anime);
    }
  }

  return (
    <div className="details">
      <div className="panel">
        <h1>{anime.title}</h1>

        {/* 🔥 Vault button */}
        <button onClick={toggleFavorite} style={{ marginBottom: 12 }}>
          {isSaved ? "★ Remove from Vault" : "☆ Save to Vault"}
        </button>

        <img
          src={
            anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
          }
          alt={anime.title}
          width="250"
        />

        <p>
          <b>Score:</b> {anime.score ?? "N/A"}
        </p>

        <p>{anime.synopsis || "No synopsis available."}</p>
      </div>
    </div>
  );
}
