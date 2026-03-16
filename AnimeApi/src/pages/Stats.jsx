import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

export default function Stats() {
  const { favorites, loadingFavorites } = useContext(FavoritesContext);

  if (loadingFavorites) {
    return (
      <div className="stats-page">
        <div className="guild-plaque">
          <h1>Vault Stats</h1>
          <div className="alert">Loading stats…</div>
        </div>
      </div>
    );
  }

  const total = favorites.length;
  const planned = favorites.filter((f) => f.status === "Planned").length;
  const watching = favorites.filter((f) => f.status === "Watching").length;
  const completed = favorites.filter((f) => f.status === "Completed").length;

  const scored = favorites.filter((f) => f.score !== null && f.score > 0);
  const avgScore =
    scored.length > 0
      ? (scored.reduce((sum, f) => sum + f.score, 0) / scored.length).toFixed(
          1,
        )
      : null;

  const completionRate =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const statuses = [
    { label: "Completed", count: completed, color: "var(--good)" },
    { label: "Watching", count: watching, color: "var(--slime)" },
    { label: "Planned", count: planned, color: "var(--warn)" },
  ];

  return (
    <div className="stats-page">
      <div className="guild-plaque">
        <h1>Vault Stats</h1>
        <p className="meta">Your adventurer record at a glance.</p>
      </div>

      {total === 0 ? (
        <div className="panel" style={{ marginTop: 16 }}>
          <p className="meta">
            Your vault is empty. Head to Browse and start adding anime.
          </p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{total}</span>
              <span className="stat-label">Total in Vault</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{watching}</span>
              <span className="stat-label">Watching</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{planned}</span>
              <span className="stat-label">Planned</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {avgScore !== null ? avgScore : "—"}
              </span>
              <span className="stat-label">Avg Score</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{completionRate}%</span>
              <span className="stat-label">Completion Rate</span>
            </div>
          </div>

          <div className="panel stats-bars">
            <h3>Status Breakdown</h3>
            {statuses.map(({ label, count, color }) => (
              <div key={label} className="stats-bar-row">
                <span className="stats-bar-label">
                  {label} <span className="muted">({count})</span>
                </span>
                <div className="stats-bar-track">
                  <div
                    className="stats-bar-fill"
                    style={{
                      width: total > 0 ? `${(count / total) * 100}%` : "0%",
                      background: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
