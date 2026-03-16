import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchFavorites,
  addFavoriteFromAnime,
  removeFavorite,
  updateFavorite,
} from "../services/favoritesApi";
import { AuthContext } from "./AuthContext";
import { useToast } from "./ToastContext";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { token } = useContext(AuthContext);
  const { addToast } = useToast();

  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");

  async function loadFavorites() {
    if (!token) {
      setFavorites([]);
      return;
    }
    setLoadingFavorites(true);
    setFavoritesError("");
    try {
      const res = await fetchFavorites();
      setFavorites(res.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Failed to load vault";
      setFavoritesError(msg);
      addToast(msg, "error");
    } finally {
      setLoadingFavorites(false);
    }
  }

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function addFavorite(anime) {
    try {
      const res = await addFavoriteFromAnime(anime);
      setFavorites((prev) => [res.data, ...prev]);
      addToast(`${anime.title} added to Vault`, "success");
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg !== "Already in favorites") {
        addToast(msg || err.message || "Failed to add", "error");
      }
    }
  }

  async function deleteFavorite(favoriteId) {
    try {
      await removeFavorite(favoriteId);
      setFavorites((prev) => prev.filter((f) => f._id !== favoriteId));
      addToast("Removed from Vault", "success");
    } catch (err) {
      addToast(
        err?.response?.data?.message || err.message || "Failed to remove",
        "error",
      );
    }
  }

  async function editFavorite(favoriteId, updates) {
    try {
      const res = await updateFavorite(favoriteId, updates);
      setFavorites((prev) =>
        prev.map((f) => (f._id === favoriteId ? res.data : f)),
      );
      addToast("Vault updated", "success");
    } catch (err) {
      addToast(
        err?.response?.data?.message || err.message || "Failed to update",
        "error",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [favorites, loadingFavorites, favoritesError],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
