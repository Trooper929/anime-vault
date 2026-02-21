import axios from "axios";

const favoritesApi = axios.create({
  baseURL: "/api/favorites",
});

// Simple “user” key without auth — stored in localStorage once
export function getUserKey() {
  const existing = localStorage.getItem("animeVaultUserKey");
  if (existing) return existing;

  const newKey = crypto.randomUUID();
  localStorage.setItem("animeVaultUserKey", newKey);
  return newKey;
}

export function fetchFavorites() {
  const userKey = getUserKey();
  return favoritesApi.get("/", { params: { userKey } });
}

export function addFavoriteFromAnime(anime) {
  const userKey = getUserKey();

  return favoritesApi.post("/", {
    userKey,
    mal_id: anime.mal_id,
    title: anime.title,
    imageUrl: anime.images?.jpg?.image_url || "",
    score: anime.score ?? null,
  });
}

export function removeFavorite(favoriteId) {
  return favoritesApi.delete(`/${favoriteId}`);
}

export function updateFavorite(favoriteId, updates) {
  return favoritesApi.put(`/${favoriteId}`, updates); // { status, notes }
}
