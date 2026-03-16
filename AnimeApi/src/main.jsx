import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import "../styles/theme.css";

// Wake up the backend on app load (Render free tier spins down when idle)
fetch(`${import.meta.env.VITE_API_URL ?? ""}/api/anime-of-the-day`).catch(() => {});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
