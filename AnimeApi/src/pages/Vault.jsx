import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext.jsx";

export default function Vault() {
  const {
    favorites,
    loadingFavorites,
    favoritesError,
    deleteFavorite,
    editFavorite,
  } = useContext(FavoritesContext);

  if (loadingFavorites) return <p>Loading your Vault...</p>;
  if (favoritesError) return <p style={{ color: "red" }}>{favoritesError}</p>;

  return (
    <div className="vault">
      <h1>My Vault</h1>

      {favorites.length === 0 ? (
        <p>No saved anime yet. Go to Browse and add some 👀</p>
      ) : (
        <div className="vault-grid">
          {favorites.map((fav) => (
            <div key={fav._id} className="vault-card">
              {fav.imageUrl ? (
                <img src={fav.imageUrl} alt={fav.title} width="120" />
              ) : (
                <div style={{ width: 120, height: 170, background: "#ddd" }} />
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <h3 style={{ margin: 0 }}>{fav.title}</h3>

                <p style={{ margin: 0 }}>
                  <strong>Status:</strong> {fav.status || "Planned"}
                </p>

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

                <button onClick={() => deleteFavorite(fav._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
