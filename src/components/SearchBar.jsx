import React from 'react';

/**
 * SearchBar Component
 * Styled following Phrase Passport's clean search / filter box:
 * Paper-light background, 1px deep ink lines, terracotta label headings,
 * and serif text styling.
 */
function SearchBar({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres = [],
  sortBy,
  onSortChange,
  totalResults,
  totalMovies,
  onResetFilters,
}) {
  const isFiltered = searchTerm.trim() !== '' || selectedGenre !== 'ALL';

  return (
    <div className="passport-search-container">
      <div className="search-box-row">
        {/* Search Input */}
        <div className="search-box-cell search-main-cell">
          <label htmlFor="movie-search-input" className="search-cell-label">
            SEARCH ARCHIVE
          </label>
          <div className="search-input-inner">
            <span className="search-glyph">🔍</span>
            <input
              type="text"
              id="movie-search-input"
              className="passport-input"
              placeholder="Search by title, genre, or language..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search movies"
            />
            {searchTerm && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => onSearchChange('')}
                title="Clear query"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Genre Filter */}
        <div className="search-box-cell">
          <label htmlFor="genre-filter-select" className="search-cell-label">
            GENRE
          </label>
          <select
            id="genre-filter-select"
            className="passport-select"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <option value="ALL">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="search-box-cell">
          <label htmlFor="sort-by-select" className="search-cell-label">
            ORDER BY
          </label>
          <select
            id="sort-by-select"
            className="passport-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="TITLE_ASC">Title: A – Z</option>
            <option value="RATING_DESC">Rating: High to Low</option>
            <option value="RATING_ASC">Rating: Low to High</option>
            <option value="YEAR_DESC">Year: Newest</option>
            <option value="YEAR_ASC">Year: Oldest</option>
            <option value="VIEWS_DESC">Views: High to Low</option>
          </select>
        </div>

        {/* Reset Action */}
        {isFiltered && (
          <div className="search-box-cell search-reset-cell">
            <button
              type="button"
              className="btn btn-outline reset-filter-btn"
              onClick={onResetFilters}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Results Meta */}
      <div className="search-meta-row">
        <span className="results-deck">
          Displaying <strong>{totalResults}</strong> of <strong>{totalMovies}</strong> curated titles
        </span>
        {isFiltered && (
          <span className="filter-pill">
            Active Filter
          </span>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
