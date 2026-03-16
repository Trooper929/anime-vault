import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/signin");
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="inner">
        <div className="brand">
          <div className="sigil" />
          <span>Anime Vault</span>
        </div>

        {user && (
          <>
            <nav className={`nav-links${menuOpen ? " nav-links--open" : ""}`}>
              <NavLink to="/" end onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/browse" onClick={() => setMenuOpen(false)}>
                Browse
              </NavLink>
              <NavLink to="/vault" onClick={() => setMenuOpen(false)}>
                Vault
              </NavLink>
              <NavLink to="/stats" onClick={() => setMenuOpen(false)}>
                Stats
              </NavLink>
              <span className="nav-username">{user.username}</span>
              <button
                className="btn-secondary nav-logout"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </nav>

            <button
              className="hamburger btn-secondary"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </>
        )}

        {!user && (
          <nav className="nav-links">
            <NavLink to="/signin">Sign In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
