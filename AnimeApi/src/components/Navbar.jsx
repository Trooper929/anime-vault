import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="inner">
        <div className="brand">
          <div className="sigil" />
          <span>Anime Vault</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/browse">Browse</NavLink>
          <NavLink to="/vault">Vault</NavLink>
        </nav>
      </div>
    </header>
  );
}
