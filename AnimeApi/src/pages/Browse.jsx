import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchAnime } from "../services/jikanApi";
import { FavoritesContext } from "../context/FavoritesContext.jsx";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();

  // read query from URL once (or whenever it changes)
  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(urlQuery);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState("");

  const {
    favorites,
    addFavorite,
    deleteFavorite,
    loadingFavorites,
    favoritesError,
  } = useContext(FavoritesContext);

  function runSearch(q) {
    const trimmed = (q ?? "").trim();
    if (!trimmed) return;

    setLoadingResults(true);
    setResultsError("");

    searchAnime(trimmed)
      .then((res) => setResults(res.data.data))
      .catch((err) => {
        console.error(err);
        setResultsError("Search failed. Try again.");
      })
      .finally(() => setLoadingResults(false));
  }

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    // ✅ store search in URL so Back preserves it
    setSearchParams({ q: trimmed });
    runSearch(trimmed);
  }

  // ✅ when URL query changes (Back button), re-run search automatically
  useEffect(() => {
    setQuery(urlQuery);
    if (urlQuery.trim()) runSearch(urlQuery);
    else setResults([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  function toggleFavorite(anime) {
    const existingFav = favorites.find((f) => f.mal_id === anime.mal_id);
    if (existingFav) deleteFavorite(existingFav._id);
    else addFavorite(anime);
  }

  return (
    <div className="browse">
      <div className="guild-plaque">
        <h1>Browse</h1>
        <p className="meta">
          Search the guild archives and save to your Vault.
        </p>

        <div className="search-row">
          <input
            type="text"
            placeholder="Search anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} disabled={!query.trim()}>
            Search
          </button>
        </div>

        {loadingResults && <div className="alert">Searching...</div>}
        {resultsError && <div className="alert error">{resultsError}</div>}

        {loadingFavorites && <div className="alert">Loading your Vault...</div>}
        {favoritesError && <div className="alert error">{favoritesError}</div>}
      </div>

      <div className="results">
        {results.map((anime) => {
          const existingFav = favorites.find((f) => f.mal_id === anime.mal_id);
          const isSaved = Boolean(existingFav);

          return (
            <div key={anime.mal_id} className="anime-card">
              <Link to={`/anime/${anime.mal_id}`}>
                <img src={anime.images?.jpg?.image_url} alt={anime.title} />
                <h3>{anime.title}</h3>
              </Link>

              <button onClick={() => toggleFavorite(anime)}>
                {isSaved ? "★ In Vault (Remove)" : "☆ Save to Vault"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
