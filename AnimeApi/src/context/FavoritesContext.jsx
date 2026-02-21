import { createContext, useEffect, useMemo, useState } from "react";
import {
  fetchFavorites,
  addFavoriteFromAnime,
  removeFavorite,
  updateFavorite,
} from "../services/favoritesApi";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [favoritesError, setFavoritesError] = useState("");

  async function loadFavorites() {
    setLoadingFavorites(true);
    setFavoritesError("");
    try {
      const res = await fetchFavorites();
      setFavorites(res.data);
    } catch (err) {
      setFavoritesError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load favorites",
      );
    } finally {
      setLoadingFavorites(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function addFavorite(anime) {
    try {
      const res = await addFavoriteFromAnime(anime);
      setFavorites((prev) => [res.data, ...prev]);
    } catch (err) {
      // If it's already in favorites, ignore quietly or show a toast later
      const msg = err?.response?.data?.message;
      if (msg !== "Already in favorites") {
        setFavoritesError(msg || err.message || "Failed to add favorite");
      }
    }
  }

  async function deleteFavorite(favoriteId) {
    try {
      await removeFavorite(favoriteId);
      setFavorites((prev) => prev.filter((f) => f._id !== favoriteId));
    } catch (err) {
      setFavoritesError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to delete favorite",
      );
    }
  }

  async function editFavorite(favoriteId, updates) {
    try {
      const res = await updateFavorite(favoriteId, updates);
      setFavorites((prev) =>
        prev.map((f) => (f._id === favoriteId ? res.data : f)),
      );
    } catch (err) {
      setFavoritesError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update favorite",
      );
    }
  }

  const value = useMemo(
    () => ({
      favorites,
      loadingFavorites,
      favoritesError,
      reloadFavorites: loadFavorites,
      addFavorite,
      deleteFavorite,
      editFavorite,
    }),
    [favorites, loadingFavorites, favoritesError],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
