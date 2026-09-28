import React, { useMemo } from 'react';

/**
 * Stats Component
 * Styled to match the Cinema Heritage metadata vouchers:
 * Clean 1px grid lines, amber gold uppercase labels, and elegant serif numbers.
 */
function Stats({ movies = [] }) {
  const stats = useMemo(() => {
    if (!movies || movies.length === 0) {
      return {
        totalMovies: 0,
        averageRating: '0.0',
        totalViews: 0,
        highestRatedMovie: null,
      };
    }

    const total = movies.length;
    let sumRating = 0;
    let sumViews = 0;
    let highest = movies[0];

    for (const movie of movies) {
      const rating = Number(movie.rating) || 0;
      const views = Number(movie.views) || 0;

      sumRating += rating;
      sumViews += views;

      if (!highest || rating > (Number(highest.rating) || 0)) {
        highest = movie;
      }
    }

    const avgRating = (sumRating / total).toFixed(1);

    return {
      totalMovies: total,
      averageRating: avgRating,
      totalViews: sumViews,
      highestRatedMovie: highest,
    };
  }, [movies]);

  return (
    <section className="passport-stats-section" aria-label="Dashboard Statistics">
      <div className="stats-header-row">
        <span className="stats-kicker">DATABASE OVERVIEW</span>
        <span className="stats-divider-line"></span>
        <span className="stats-stamp">COLLEGE PRACTICAL VIVA</span>
      </div>

      <div className="stats-grid-container">
        {/* Total Movies */}
        <div className="stat-voucher">
          <span className="voucher-eyebrow">TOTAL FILMS</span>
          <div className="voucher-value-wrap">
            <span className="voucher-value" id="stat-total-movies">
              {stats.totalMovies}
            </span>
            <span className="voucher-unit">TITLES</span>
          </div>
          <span className="voucher-footer">Synced with MockAPI</span>
        </div>

        {/* Average Rating */}
        <div className="stat-voucher">
          <span className="voucher-eyebrow">AVERAGE RATING</span>
          <div className="voucher-value-wrap">
            <span className="voucher-value" id="stat-avg-rating">
              {stats.averageRating}
            </span>
            <span className="voucher-unit">/ 5.0</span>
          </div>
          <span className="voucher-footer">Aggregated critical score</span>
        </div>

        {/* Total Views */}
        <div className="stat-voucher">
          <span className="voucher-eyebrow">GLOBAL ENGAGEMENT</span>
          <div className="voucher-value-wrap">
            <span className="voucher-value" id="stat-total-views">
              {stats.totalViews.toLocaleString()}
            </span>
            <span className="voucher-unit">VIEWS</span>
          </div>
          <span className="voucher-footer">Cumulative watch counts</span>
        </div>

        {/* Highest Rated Movie */}
        <div className="stat-voucher voucher-highlight">
          <span className="voucher-eyebrow">TOP RATED FEATURE</span>
          <div className="voucher-value-wrap">
            <span className="voucher-value voucher-title" id="stat-highest-rated" title={stats.highestRatedMovie?.title || 'None'}>
              {stats.highestRatedMovie ? stats.highestRatedMovie.title : 'None'}
            </span>
            {stats.highestRatedMovie && (
              <span className="voucher-rating-badge">★ {Number(stats.highestRatedMovie.rating).toFixed(1)}</span>
            )}
          </div>
          <span className="voucher-footer">
            {stats.highestRatedMovie ? `${stats.highestRatedMovie.genre} • ${stats.highestRatedMovie.year}` : 'Awaiting entries'}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Stats;
