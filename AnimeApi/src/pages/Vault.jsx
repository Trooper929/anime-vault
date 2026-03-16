import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext.jsx";
import StarRating from "../components/StarRating";
import SkeletonCard from "../components/SkeletonCard";

const STATUS_OPTIONS = ["All", "Planned", "Watching", "Completed"];
const SORT_OPTIONS = [
  { value: "date-desc", label: "Date Added (Newest)" },
  { value: "date-asc", label: "Date Added (Oldest)" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "score-desc", label: "Score (High–Low)" },
  { value: "score-asc", label: "Score (Low–High)" },
];

export default function Vault() {
  const { favorites, loadingFavorites, deleteFavorite, editFavorite } =
    useContext(FavoritesContext);

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("date-desc");

  const displayed = useMemo(() => {
    let list = [...favorites];

    if (filterStatus !== "All") {
      list = list.filter((f) => f.status === filterStatus);
    }

    list.sort((a, b) => {
      switch (sortOrder) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "score-desc":
          return (b.score ?? -1) - (a.score ?? -1);
        case "score-asc":
          return (a.score ?? 999) - (b.score ?? 999);
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default: // date-desc
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return list;
  }, [favorites, filterStatus, sortOrder]);

  if (loadingFavorites) {
    return (
      <div className="vault">
        <h1>My Vault</h1>
        <div className="vault-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="vault">
      <div className="guild-plaque">
        <h1>My Vault</h1>
        <p className="meta">{favorites.length} anime saved.</p>
      </div>

      {favorites.length > 0 && (
        <div className="vault-controls">
          <div className="vault-filter">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className={`btn-secondary vault-filter-btn${filterStatus === s ? " vault-filter-btn--active" : ""}`}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="vault-sort"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="alert" style={{ marginTop: 16 }}>
          {favorites.length === 0
            ? "No saved anime yet. Go to Browse and add some."
            : `No anime with status "${filterStatus}".`}
        </div>
      ) : (
        <div className="vault-grid">
          {displayed.map((fav, i) => (
            <div key={fav._id} className="vault-card" style={{ '--card-index': i }}>
              <Link to={`/anime/${fav.mal_id}`} className="vault-card-img-link">
                {fav.imageUrl ? (
                  <img src={fav.imageUrl} alt={fav.title} />
                ) : (
                  <div className="vault-card-img-placeholder" />
                )}
              </Link>

              <div className="vault-card-body">
                <Link to={`/anime/${fav.mal_id}`} className="vault-card-title-link">
                  <h3>{fav.title}</h3>
                </Link>

                <select
                  value={fav.status || "Planned"}
                  onChange={(e) =>
                    editFavorite(fav._id, { status: e.target.value })
                  }
                >
                  <option value="Planned">Planned</option>
                  <option value="Watching">Watching</option>
                  <option value="Completed">Completed</option>
                </select>

                <div className="vault-score-label">
                  Your Score:{" "}
                  <strong>{fav.score !== null ? fav.score : "—"}</strong>
                </div>
                <StarRating
                  score={fav.score}
                  onChange={(val) => editFavorite(fav._id, { score: val })}
                />

                <div className="vault-card-actions">
                  <button
                    className="btn-secondary"
                    onClick={async () => {
                      const url = `${window.location.origin}/anime/${fav.mal_id}`;
                      const shareData = { title: fav.title, text: `Check out ${fav.title} — you should watch this!`, url };
                      if (navigator.canShare && navigator.canShare(shareData)) {
                        await navigator.share(shareData);
                      } else {
                        await navigator.clipboard.writeText(url);
                        alert("Link copied to clipboard!");
                      }
                    }}
                  >
                    Share
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => deleteFavorite(fav._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
