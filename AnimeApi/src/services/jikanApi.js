import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

export function searchAnime(query) {
  return axios.get(`${BASE_URL}/anime`, {
    params: { q: query },
  });
}

export function getAnimeById(id) {
  return axios.get(`${BASE_URL}/anime/${id}`);
}
