export default function Pagination({ page, hasNextPage, onPageChange }) {
  return (
    <div className="pagination">
      <button
        className="btn-secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ← Prev
      </button>
      <span className="page-indicator">Page {page}</span>
      <button
        className="btn-secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next →
      </button>
    </div>
  );
}
