import { useEffect, useState } from "react";
import { getGenres } from "../services/jikanApi";

export default function GenreFilter({ selectedGenres, onChange }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then((list) => setGenres(list));
  }, []);

  if (genres.length === 0) return null;

  function toggle(id) {
    if (selectedGenres.includes(id)) {
      onChange(selectedGenres.filter((g) => g !== id));
    } else {
      onChange([...selectedGenres, id]);
    }
  }

  return (
    <div className="genre-filter">
      {genres.map((g) => (
        <button
          key={g.mal_id}
          type="button"
          className={`genre-pill btn-secondary${selectedGenres.includes(g.mal_id) ? " genre-pill--active" : ""}`}
          onClick={() => toggle(g.mal_id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
