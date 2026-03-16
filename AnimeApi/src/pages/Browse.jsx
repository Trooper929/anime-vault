import { useContext, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  searchAnime,
  getTopAnime,
  getSeasonNow,
} from "../services/jikanApi";
import { FavoritesContext } from "../context/FavoritesContext.jsx";
import { useAuth } from "../context/AuthContext";
import SkeletonCard from "../components/SkeletonCard";
import GenreFilter from "../components/GenreFilter";
import Pagination from "../components/Pagination";

const TABS = ["search", "top", "seasonal"];

export default function Browse() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const urlTab = TABS.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "search";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  const [query, setQuery] = useState(urlQuery);
  const [tab, setTab] = useState(urlTab);
  const [page, setPage] = useState(urlPage);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({ has_next_page: false });
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState("");

  const { favorites, addFavorite, deleteFavorite } =
    useContext(FavoritesContext);

  const debounceRef = useRef(null);

  function updateParams(updates) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") next.set(k, v);
        else next.delete(k);
      });
      return next;
    });
  }

  async function runFetch(currentTab, currentPage, currentQuery, genres) {
    setLoadingResults(true);
    setResultsError("");
    setResults([]);
    try {
      let res;
      if (currentTab === "search") {
        if (!currentQuery.trim() && genres.length === 0) {
          setLoadingResults(false);
          return;
        }
        res = await searchAnime(currentQuery.trim(), currentPage, genres);
      } else if (currentTab === "top") {
        res = await getTopAnime(currentPage, genres);
      } else {
        res = await getSeasonNow(currentPage);
      }
      setResults(res.data.data || []);
      setPagination(res.data.pagination || { has_next_page: false });
    } catch {
      setResultsError("Failed to load. Try again.");
    } finally {
      setLoadingResults(false);
    }
  }

  // Re-fetch when URL params change
  useEffect(() => {
    setQuery(urlQuery);
    setTab(urlTab);
    setPage(urlPage);
    runFetch(urlTab, urlPage, urlQuery, selectedGenres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery, urlTab, urlPage]);

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    updateParams({ q: trimmed, tab: "search", page: 1 });
  }

  function handleTabChange(newTab) {
    setSelectedGenres([]);
    updateParams({ tab: newTab, page: 1, q: newTab === "search" ? urlQuery : null });
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage });
  }

  function handleGenreChange(genres) {
    setSelectedGenres(genres);
    // Debounce the re-fetch to avoid hammering API
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runFetch(tab, 1, query, genres);
      updateParams({ page: 1 });
    }, 400);
  }

  function toggleFavorite(anime) {
    const existingFav = favorites.find((f) => f.mal_id === anime.mal_id);
    if (existingFav) deleteFavorite(existingFav._id);
    else addFavorite(anime);
  }

  return (
    <div className="browse">
      <div className="guild-plaque">
        <h1>Browse</h1>
        <p className="meta">Search the guild archives and save to your Vault.</p>

        <div className="browse-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`browse-tab btn-secondary${tab === t ? " browse-tab--active" : ""}`}
              onClick={() => handleTabChange(t)}
            >
              {t === "search" ? "Search" : t === "top" ? "Top Anime" : "Seasonal"}
            </button>
          ))}
        </div>

        {tab === "search" && (
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
        )}

        {(tab === "search" || tab === "top") && (
          <GenreFilter
            selectedGenres={selectedGenres}
            onChange={handleGenreChange}
          />
        )}

        {resultsError && <div className="alert error">{resultsError}</div>}
      </div>

      {tab === "seasonal" && !token ? (
        <div className="seasonal-lock panel">
          <span className="seasonal-lock-icon">🔒</span>
          <h2>Members Only</h2>
          <p className="meta">Sign in to view current seasonal anime.</p>
          <Link to="/signin"><button>Sign In</button></Link>
        </div>
      ) : (
      <div className="results">
        {loadingResults
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : results.map((anime, i) => {
              const existingFav = favorites.find(
                (f) => f.mal_id === anime.mal_id,
              );
              const isSaved = Boolean(existingFav);

              return (
                <div key={anime.mal_id} className="anime-card" style={{ '--card-index': i }}>
                  <Link to={`/anime/${anime.mal_id}`}>
                    <img
                      src={anime.images?.jpg?.image_url}
                      alt={anime.title}
                    />
                    <h3>{anime.title}</h3>
                    {anime.score && (
                      <p className="meta">★ {anime.score}</p>
                    )}
                  </Link>
                  {token && (
                    <button onClick={() => toggleFavorite(anime)}>
                      {isSaved ? "★ In Vault (Remove)" : "☆ Save to Vault"}
                    </button>
                  )}
                </div>
              );
            })}
      </div>
      )}

      {!loadingResults && results.length > 0 && (
        <Pagination
          page={page}
          hasNextPage={pagination.has_next_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
