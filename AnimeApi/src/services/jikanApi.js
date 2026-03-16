import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

let cachedGenres = null;

export function searchAnime(query, page = 1, genres = []) {
  const params = { q: query, page };
  if (genres.length > 0) params.genres = genres.join(",");
  return axios.get(`${BASE_URL}/anime`, { params });
}

export function getAnimeById(id) {
  return axios.get(`${BASE_URL}/anime/${id}`);
}

export function getTopAnime(page = 1, genres = []) {
  const params = { page };
  if (genres.length > 0) params.genres = genres.join(",");
  return axios.get(`${BASE_URL}/top/anime`, { params });
}

export function getSeasonNow(page = 1) {
  return axios.get(`${BASE_URL}/seasons/now`, { params: { page } });
}

export async function getGenres() {
  if (cachedGenres) return cachedGenres;
  const res = await axios.get(`${BASE_URL}/genres/anime`);
  cachedGenres = res.data.data;
  return cachedGenres;
}
