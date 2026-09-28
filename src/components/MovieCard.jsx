import React, { useState } from 'react';

/**
 * MovieCard Component
 * Implements the Cinema Heritage guide-card aesthetic:
 * Refined 1px grid borders, amber gold italic metadata, large serif titles,
 * and the iconic bottom-right concentric circle reel watermark.
 */
function MovieCard({ movie, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  const hasValidPoster = movie.posterUrl && movie.posterUrl.trim() !== '' && !imageError;
  const formattedViews = Number(movie.views || 0).toLocaleString();

  // Short genre/lang code (e.g., SCI, COM, DRA, ENG, HIN)
  const code = (movie.language || 'MOV').slice(0, 3).toUpperCase();

  return (
    <article className="guide-card" data-movie-id={movie.id}>
      {/* Top row: Language code & rating */}
      <div className="guide-card-top">
        <span className="card-top-code">
          {code} • {movie.year}
        </span>
        <div className="card-top-rating" title={`Rating: ${movie.rating} / 5.0`}>
          <span className="star-char">★</span>
          <span className="rating-val">{Number(movie.rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Eyebrow: Genre & ID */}
      <p className="guide-card-eyebrow">
        {movie.genre} • #{movie.id}
      </p>

      {/* Main Title in Serif */}
      <h3 className="guide-card-title" title={movie.title}>
        {movie.title}
      </h3>

      {/* Poster or Editorial Placeholder */}
      <div className="guide-card-media">
        {hasValidPoster ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="guide-card-poster"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="guide-card-placeholder">
            <div className="placeholder-stamp">
              <span className="stamp-monogram">{movie.title.slice(0, 2).toUpperCase()}</span>
              <span className="stamp-label">ARCHIVE #{movie.id}</span>
            </div>
            <span className="stamp-sub">{movie.language} • {movie.genre}</span>
          </div>
        )}
      </div>

      {/* Metadata deck */}
      <div className="guide-card-deck">
        <div className="deck-item">
          <span className="deck-label">AUDIENCE VIEWS</span>
          <span className="deck-value">{formattedViews}</span>
        </div>
        <div className="deck-item">
          <span className="deck-label">LANGUAGE</span>
          <span className="deck-value">{movie.language}</span>
        </div>
      </div>

      {/* Bottom actions matching Passport style */}
      <div className="guide-card-actions">
        <button
          type="button"
          className="card-action-btn btn-action-edit"
          onClick={() => onEdit(movie)}
          aria-label={`Edit ${movie.title}`}
        >
          <span>EDIT FILM</span>
          <span className="action-arrow">↗</span>
        </button>

        <button
          type="button"
          className="card-action-btn btn-action-delete"
          onClick={() => onDelete(movie)}
          aria-label={`Delete ${movie.title}`}
        >
          <span>DELETE</span>
        </button>
      </div>
    </article>
  );
}

export default MovieCard;
