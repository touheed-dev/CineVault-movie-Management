import React, { useState, useEffect } from 'react';

const CURRENT_YEAR = new Date().getFullYear();

function getInitialFormData(movieToEdit) {
  if (movieToEdit) {
    return {
      title: movieToEdit.title || '',
      genre: movieToEdit.genre || '',
      year: movieToEdit.year ?? CURRENT_YEAR,
      rating: movieToEdit.rating ?? 4.5,
      language: movieToEdit.language || 'English',
      views: movieToEdit.views ?? 0,
      posterUrl: movieToEdit.posterUrl || '',
    };
  }
  return {
    title: '',
    genre: '',
    year: CURRENT_YEAR,
    rating: 4.5,
    language: 'English',
    views: 0,
    posterUrl: '',
  };
}

/**
 * MovieForm Component (Modal)
 * Handles both CREATE (POST) and UPDATE (PUT) operations.
 */
function MovieForm({ isOpen, onClose, onSubmit, movieToEdit, isSubmitting }) {
  const isEditMode = Boolean(movieToEdit);

  // Form field states initialized based on props
  const [formData, setFormData] = useState(() => getInitialFormData(movieToEdit));

  // Validation errors
  const [errors, setErrors] = useState({});

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Generic input change handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));

    // Clear error for field once edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Form validation strictly matching practical specifications
  const validateForm = () => {
    const newErrors = {};

    // 1. Title cannot be empty
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required and cannot be empty.';
    }

    // 2. Genre cannot be empty
    if (!formData.genre || formData.genre.trim() === '') {
      newErrors.genre = 'Genre is required.';
    }

    // 3. Year must be a valid number
    const maxAllowedYear = CURRENT_YEAR + 10;
    if (formData.year === '' || isNaN(formData.year)) {
      newErrors.year = 'Year must be a valid number.';
    } else if (Number(formData.year) < 1888 || Number(formData.year) > maxAllowedYear) {
      newErrors.year = `Year must be between 1888 and ${maxAllowedYear}.`;
    }

    // 4. Rating must be between 0 and 5
    if (formData.rating === '' || isNaN(formData.rating)) {
      newErrors.rating = 'Rating is required.';
    } else if (Number(formData.rating) < 0 || Number(formData.rating) > 5) {
      newErrors.rating = 'Rating must be between 0.0 and 5.0.';
    }

    // 5. Views cannot be negative
    if (formData.views === '' || isNaN(formData.views)) {
      newErrors.views = 'Views count must be a number.';
    } else if (Number(formData.views) < 0) {
      newErrors.views = 'Views cannot be negative.';
    }

    // 6. Language cannot be empty
    if (!formData.language || formData.language.trim() === '') {
      newErrors.language = 'Language is required.';
    }

    // 7. Poster URL is optional (no error if empty)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const popularGenres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Romance', 'Animation', 'Adventure', 'Mystery'];
  const popularLanguages = ['English', 'Hindi', 'Kannada', 'Spanish', 'French', 'Japanese', 'Korean', 'Tamil', 'Telugu', 'German'];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge-op">
              {isEditMode ? 'PUT /movies/:id' : 'POST /movies'}
            </span>
            <h2 className="modal-title">
              {isEditMode ? `Edit Movie: ${movieToEdit.title}` : 'Add New Movie to CineVault'}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} noValidate className="movie-form">
          <div className="form-grid">
            {/* Title field */}
            <div className="form-group full-width">
              <label htmlFor="movie-title">
                Movie Title <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="movie-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Inception, 3 Idiots"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                autoFocus
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Genre field */}
            <div className="form-group">
              <label htmlFor="movie-genre">
                Genre <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="movie-genre"
                name="genre"
                list="genre-suggestions"
                value={formData.genre}
                onChange={handleChange}
                placeholder="e.g. Sci-Fi, Comedy"
                className={`form-input ${errors.genre ? 'input-error' : ''}`}
              />
              <datalist id="genre-suggestions">
                {popularGenres.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
              {errors.genre && <span className="error-message">{errors.genre}</span>}
            </div>

            {/* Language field */}
            <div className="form-group">
              <label htmlFor="movie-language">
                Language <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="movie-language"
                name="language"
                list="lang-suggestions"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g. English, Hindi, Kannada"
                className={`form-input ${errors.language ? 'input-error' : ''}`}
              />
              <datalist id="lang-suggestions">
                {popularLanguages.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
              {errors.language && <span className="error-message">{errors.language}</span>}
            </div>

            {/* Year field */}
            <div className="form-group">
              <label htmlFor="movie-year">
                Release Year <span className="required-star">*</span>
              </label>
              <input
                type="number"
                id="movie-year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1888"
                max="2099"
                placeholder="e.g. 2010"
                className={`form-input ${errors.year ? 'input-error' : ''}`}
              />
              {errors.year && <span className="error-message">{errors.year}</span>}
            </div>

            {/* Rating field */}
            <div className="form-group">
              <label htmlFor="movie-rating">
                Rating (0.0 to 5.0) <span className="required-star">*</span>
              </label>
              <input
                type="number"
                id="movie-rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="5"
                placeholder="e.g. 4.8"
                className={`form-input ${errors.rating ? 'input-error' : ''}`}
              />
              {errors.rating && <span className="error-message">{errors.rating}</span>}
            </div>

            {/* Views field */}
            <div className="form-group">
              <label htmlFor="movie-views">
                Views Count <span className="required-star">*</span>
              </label>
              <input
                type="number"
                id="movie-views"
                name="views"
                value={formData.views}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 500000"
                className={`form-input ${errors.views ? 'input-error' : ''}`}
              />
              {errors.views && <span className="error-message">{errors.views}</span>}
            </div>

            {/* Poster URL field (optional) */}
            <div className="form-group full-width">
              <label htmlFor="movie-poster">
                Poster Image URL <span className="optional-tag">(Optional)</span>
              </label>
              <input
                type="text"
                id="movie-poster"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg (leave blank for clean placeholder)"
                className="form-input"
              />
              <span className="field-hint">
                If left empty or invalid, CineVault renders an automatic cinema placeholder.
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="submit-movie-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>{isEditMode ? 'Updating in MockAPI...' : 'Creating in MockAPI...'}</span>
                </>
              ) : (
                <span>{isEditMode ? '💾 Save Changes' : '➕ Create Movie'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MovieForm;
