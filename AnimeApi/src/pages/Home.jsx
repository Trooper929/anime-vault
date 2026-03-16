import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnimeOfTheDayCard from "../components/AnimeOfTheDayCard";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="guild-plaque">
        <h1>Welcome back, {user?.username}.</h1>
        <p className="meta">
          Your adventurer record awaits. Browse the archives, track your
          progress, and rate what you've conquered.
        </p>
        <div className="home-actions">
          <Link to="/browse">
            <button>Browse Anime</button>
          </Link>
          <Link to="/vault">
            <button className="btn-secondary">My Vault</button>
          </Link>
        </div>
      </div>

      <AnimeOfTheDayCard />
    </div>
  );
}
