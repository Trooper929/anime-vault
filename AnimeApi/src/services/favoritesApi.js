import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "";

const favoritesApi = axios.create({ baseURL: `${BASE}/api/favorites` });

// Attach JWT on every request
favoritesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("animeVaultToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function fetchFavorites() {
  return favoritesApi.get("/");
}

export function addFavoriteFromAnime(anime) {
  return favoritesApi.post("/", {
    mal_id: anime.mal_id,
    title: anime.title,
    imageUrl: anime.images?.jpg?.image_url || "",
  });
}

export function removeFavorite(favoriteId) {
  return favoritesApi.delete(`/${favoriteId}`);
}

export function updateFavorite(favoriteId, updates) {
  return favoritesApi.put(`/${favoriteId}`, updates);
}
