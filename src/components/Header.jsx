import React from 'react';

/**
 * Header Component
 * Styled following the Phrase Passport editorial layout:
 * Warm paper background, serif typography, deep ink wordmark, and terracotta accents.
 */
function Header({ onAddMovie, onLoadSampleData, onRefresh, isRefreshing, isSeeding, movieCount }) {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Editorial Wordmark */}
        <div className="wordmark">
          <div className="brand-mark-wrapper">
            <img src="/logo.jpg" alt="CineVault" className="brand-mark" />
          </div>
          <div className="wordmark-titles">
            <span className="wordmark-main">Cine<br />Vault</span>
          </div>
          <div className="wordmark-divider"></div>
          <div className="wordmark-meta">
            <span className="wordmark-tag">REST API</span>
            <span className="wordmark-count">{movieCount} {movieCount === 1 ? 'Film' : 'Films'}</span>
          </div>
        </div>

        {/* Navigation & Action Controls */}
        <nav className="header-nav" aria-label="Main controls">
          <span className="header-motto">Cinema is a kind of luggage.</span>

          {/* Sync / Refresh Button */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={onRefresh}
            disabled={isRefreshing || isSeeding}
            title="Fetch latest data from MockAPI (GET /movies)"
          >
            <span className={`btn-icon ${isRefreshing ? 'spin' : ''}`}>↻</span>
            <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Load Sample Movies Button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onLoadSampleData}
            disabled={isSeeding || isRefreshing}
            title="Add a varied batch of world cinema films across different countries & languages (POST)"
          >
            <span>{isSeeding ? 'Adding...' : '⚡ Add Global Samples'}</span>
          </button>

          {/* Primary Add Movie Button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddMovie}
            disabled={isSeeding}
            id="add-movie-btn"
          >
            <span>Add Movie</span>
            <span className="btn-arrow">↗</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
