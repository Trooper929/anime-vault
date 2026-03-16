export default function StarRating({ score, onChange }) {
  return (
    <div className="star-rating">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`star-btn${score >= n ? " star-btn--active" : ""}`}
          onClick={() => onChange(score === n ? null : n)}
          title={`Rate ${n}`}
          type="button"
        >
          {n}
        </button>
      ))}
    </div>
  );
}
