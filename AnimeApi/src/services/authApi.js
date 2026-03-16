import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "";

const authApi = axios.create({ baseURL: `${BASE}/api/auth` });

export function registerUser({ username, email, password }) {
  return authApi.post("/register", { username, email, password });
}

export function loginUser({ email, password }) {
  return authApi.post("/login", { email, password });
}
