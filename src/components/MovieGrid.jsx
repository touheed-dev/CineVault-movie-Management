import React from 'react';
import MovieCard from './MovieCard';

/**
 * MovieGrid Component
 * Handles the display of the movie card grid along with Loading, Error,
 * and Empty/Zero states.
 */
function MovieGrid({
  movies,
  isLoading,
  error,
  onRetry,
  onEditMovie,
  onDeleteMovie,
  onAddNewMovie,
  searchTerm,
  selectedGenre,
}) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="grid-state-container" aria-live="polite">
        <div className="loading-spinner-wrapper">
          <div className="cinema-spinner"></div>
          <p className="loading-text">Loading movies from MockAPI...</p>
          <span className="loading-subtext">Executing GET /movies</span>
        </div>
      </div>
    );
  }

  // 2. Error State with Retry Button
  if (error) {
    return (
      <div className="grid-state-container error-state" role="alert">
        <div className="state-icon">⚠️</div>
        <h3 className="state-title">Unable to Load Movies</h3>
        <p className="state-description">{error}</p>
        <button
          type="button"
          className="btn btn-primary retry-btn"
          onClick={onRetry}
        >
          <span>🔄 Retry Fetch</span>
        </button>
      </div>
    );
  }

  // 3. Filtered/Search Empty State
  if (movies.length === 0 && (searchTerm || selectedGenre !== 'ALL')) {
    return (
      <div className="grid-state-container empty-search-state">
        <div className="state-icon">🔍</div>
        <h3 className="state-title">No Matching Movies Found</h3>
        <p className="state-description">
          We couldn't find any movies matching "{searchTerm}" {selectedGenre !== 'ALL' ? `in ${selectedGenre}` : ''}.
        </p>
      </div>
    );
  }

  // 4. Initial Empty Database State
  if (movies.length === 0) {
    return (
      <div className="grid-state-container empty-database-state">
        <div className="state-icon">🎞️</div>
        <h3 className="state-title">No Movies in CineVault Yet</h3>
        <p className="state-description">
          Your MockAPI collection is currently empty. Get started by adding your first movie or loading sample movies.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAddNewMovie}
        >
          <span>+ Add Your First Movie</span>
        </button>
      </div>
    );
  }

  // 5. Normal Grid of Movies
  return (
    <div className="catalog-grid-wrapper">
      <div className="section-title-block">
        <p className="section-kicker">READY FOR THE SCREEN</p>
        <h2 className="section-title">Curated feature archives</h2>
      </div>
      <div className="guide-card-grid movie-grid" id="movie-grid-container">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onEdit={onEditMovie}
            onDelete={onDeleteMovie}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieGrid;
