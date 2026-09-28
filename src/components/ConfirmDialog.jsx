import React, { useEffect } from 'react';

/**
 * ConfirmDialog Component
 * Prompts user for explicit confirmation before executing DELETE /movies/:id
 */
function ConfirmDialog({ isOpen, onClose, onConfirm, movie, isDeleting }) {
  // Close dialog on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !movie) return null;

  return (
    <div className="modal-overlay danger-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="confirm-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrap">
          <span className="confirm-icon">⚠️</span>
        </div>

        <div className="confirm-header">
          <span className="modal-badge-op danger-badge">DELETE /movies/{movie.id}</span>
          <h3 className="confirm-title">Delete Movie</h3>
        </div>

        <p className="confirm-message">
          Are you sure you want to delete this movie?
        </p>

        <div className="movie-to-delete-card">
          <span className="movie-to-delete-title">{movie.title}</span>
          <span className="movie-to-delete-sub">
            {movie.genre} • {movie.year} • ID #{movie.id}
          </span>
        </div>

        <p className="confirm-warning-note">
          This operation will delete the record directly from your MockAPI database. This action cannot be undone.
        </p>

        <div className="confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            id="confirm-delete-btn"
          >
            {isDeleting ? (
              <>
                <span className="btn-spinner"></span>
                <span>Deleting from MockAPI...</span>
              </>
            ) : (
              <span>🗑️ Yes, Delete Movie</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
