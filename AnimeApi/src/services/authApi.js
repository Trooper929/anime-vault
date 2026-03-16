import axios from "axios";

const authApi = axios.create({ baseURL: "/api/auth" });

export function registerUser({ username, email, password }) {
  return authApi.post("/register", { username, email, password });
}

export function loginUser({ email, password }) {
  return authApi.post("/login", { email, password });
}
