import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Stats from './components/Stats';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieForm from './components/MovieForm';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import movieService from './services/movieService';

/**
 * CineVault – Movie Management System
 * College Practical Implementation for Complete CRUD with MockAPI
 */
function App() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  // 1. Data states
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Search, Filter, Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState('TITLE_ASC');

  // 3. Form Modal states (Create & Update)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 4. Delete Confirmation states
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 5. User Feedback (Toast) state
  const [toast, setToast] = useState(null);

  // 6. Action status states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [lastRestOp, setLastRestOp] = useState({
    method: 'READY',
    endpoint: '/movies',
    status: 'Idle',
  });

  // Helper to show toasts
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  // ==========================================
  // CRUD OPERATION 1: READ (GET /movies)
  // ==========================================
  const fetchMovies = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    setLastRestOp({ method: 'GET', endpoint: '/movies', status: 'Fetching...' });

    try {
      const data = await movieService.getAllMovies();
      // Ensure data is array
      const movieList = Array.isArray(data) ? data : [];
      setMovies(movieList);
      setLastRestOp({ method: 'GET', endpoint: '/movies', status: '200 OK' });
      if (isManualRefresh) {
        showToast('Movies synced successfully with MockAPI.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch movies from MockAPI. Please verify network connection.');
      setLastRestOp({ method: 'GET', endpoint: '/movies', status: 'Error' });
      showToast('Could not fetch movies from MockAPI.', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch movies on component mount
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    fetchMovies();
  }, [fetchMovies]);

  // ==========================================
  // CRUD OPERATION 2 & 3: CREATE (POST) & UPDATE (PUT)
  // ==========================================
  // Open modal in CREATE mode
  const handleOpenAddModal = () => {
    setMovieToEdit(null);
    setIsFormOpen(true);
  };

  // Open modal in UPDATE mode
  const handleOpenEditModal = (movie) => {
    setMovieToEdit(movie);
    setIsFormOpen(true);
  };

  // Close modal
  const handleCloseFormModal = () => {
    if (!isSubmitting) {
      setIsFormOpen(false);
      setMovieToEdit(null);
    }
  };

  // Handle Form Submission (handles both CREATE and UPDATE)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

    if (movieToEdit) {
      // ------------------------------------------
      // UPDATE: PUT /movies/:id
      // ------------------------------------------
      setLastRestOp({ method: 'PUT', endpoint: `/movies/${movieToEdit.id}`, status: 'Updating...' });
      try {
        await movieService.updateMovie(movieToEdit.id, formData);
        setLastRestOp({ method: 'PUT', endpoint: `/movies/${movieToEdit.id}`, status: '200 OK' });
        showToast('Movie updated successfully');
        setIsFormOpen(false);
        setMovieToEdit(null);
        await fetchMovies();
      } catch (err) {
        console.error('Update error:', err);
        showToast('Failed to update movie. Please try again.', 'error');
        setLastRestOp({ method: 'PUT', endpoint: `/movies/${movieToEdit.id}`, status: 'Failed' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // ------------------------------------------
      // CREATE: POST /movies
      // ------------------------------------------
      setLastRestOp({ method: 'POST', endpoint: '/movies', status: 'Creating...' });
      try {
        await movieService.createMovie(formData);
        setLastRestOp({ method: 'POST', endpoint: '/movies', status: '201 Created' });
        showToast('Movie created successfully');
        setIsFormOpen(false);
        await fetchMovies();
      } catch (err) {
        console.error('Create error:', err);
        showToast('Failed to create movie. Please try again.', 'error');
        setLastRestOp({ method: 'POST', endpoint: '/movies', status: 'Failed' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ==========================================
  // CRUD OPERATION 4: DELETE (DELETE /movies/:id)
  // ==========================================
  // Prompt user for confirmation before deletion
  const handleDeleteRequest = (movie) => {
    setMovieToDelete(movie);
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setMovieToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;

    setIsDeleting(true);
    setLastRestOp({ method: 'DELETE', endpoint: `/movies/${movieToDelete.id}`, status: 'Deleting...' });

    try {
      await movieService.deleteMovie(movieToDelete.id);
      setLastRestOp({ method: 'DELETE', endpoint: `/movies/${movieToDelete.id}`, status: '200 OK' });
      showToast('Movie deleted successfully');
      setMovieToDelete(null);
      await fetchMovies();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete movie from MockAPI.', 'error');
      setLastRestOp({ method: 'DELETE', endpoint: `/movies/${movieToDelete.id}`, status: 'Failed' });
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // OPTIONAL SAMPLE DATA SEEDER (POST)
  // ==========================================
  const handleLoadSampleData = async () => {
    setIsSeeding(true);
    setLastRestOp({ method: 'POST (batch)', endpoint: '/movies', status: 'Seeding...' });

    try {
      // Pass existing movies to dynamically pick new titles across diverse countries
      const added = await movieService.createSampleMovies(movies, 4);
      setLastRestOp({ method: 'POST (batch)', endpoint: '/movies', status: '201 Created' });

      if (added && added.length > 0) {
        const titles = added.map((m) => m.title).join(', ');
        showToast(`Added ${added.length} global titles: ${titles}`);
      } else {
        showToast('All global sample movies are already in the vault!');
      }
      await fetchMovies();
    } catch (err) {
      console.error('Seed error:', err);
      showToast('Failed to seed sample movies.', 'error');
      setLastRestOp({ method: 'POST (batch)', endpoint: '/movies', status: 'Failed' });
    } finally {
      setIsSeeding(false);
    }
  };

  // ==========================================
  // DYNAMIC GENRE EXTRACTION
  // ==========================================
  const availableGenres = useMemo(() => {
    const genreSet = new Set();
    movies.forEach((m) => {
      if (m.genre && typeof m.genre === 'string') {
        const cleaned = m.genre.trim();
        if (cleaned) {
          genreSet.add(cleaned);
        }
      }
    });
    return Array.from(genreSet).sort();
  }, [movies]);

  // ==========================================
  // SEARCH, FILTER & SORT DERIVED DATA
  // ==========================================
  const processedMovies = useMemo(() => {
    let result = [...movies];

    // 1. Search filter: Title, Genre, Language
    if (searchTerm.trim() !== '') {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((m) => {
        const titleMatch = m.title?.toLowerCase().includes(q);
        const genreMatch = m.genre?.toLowerCase().includes(q);
        const langMatch = m.language?.toLowerCase().includes(q);
        return titleMatch || genreMatch || langMatch;
      });
    }

    // 2. Genre filter
    if (selectedGenre !== 'ALL') {
      result = result.filter(
        (m) => m.genre?.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'TITLE_ASC':
          return (a.title || '').localeCompare(b.title || '');
        case 'RATING_DESC':
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case 'RATING_ASC':
          return (Number(a.rating) || 0) - (Number(b.rating) || 0);
        case 'YEAR_DESC':
          return (Number(b.year) || 0) - (Number(a.year) || 0);
        case 'YEAR_ASC':
          return (Number(a.year) || 0) - (Number(b.year) || 0);
        case 'VIEWS_DESC':
          return (Number(b.views) || 0) - (Number(a.views) || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('ALL');
    setSortBy('TITLE_ASC');
  };

  return (
    <div className="cinevault-app">
      {/* 1. Header with branding and top actions */}
      <Header
        onAddMovie={handleOpenAddModal}
        onLoadSampleData={handleLoadSampleData}
        onRefresh={() => fetchMovies(true)}
        isRefreshing={isRefreshing}
        isSeeding={isSeeding}
        movieCount={movies.length}
      />

      {/* REST API Status Banner for Viva Demonstration */}
      <div className="rest-status-bar" role="status">
        <div className="rest-status-inner">
          <div className="rest-info-tag">
            <span className="dot-pulse"></span>
            <span className="rest-label">Live MockAPI:</span>
            <code className="rest-code">https://6aba51f75b549d818d624667.mockapi.io/api/v1/movies</code>
          </div>
          <div className="rest-op-indicator">
            <span className="op-pill">{lastRestOp.method}</span>
            <span className="op-endpoint">{lastRestOp.endpoint}</span>
            <span className={`op-status op-status-${lastRestOp.status.toLowerCase().replace(/[^a-z]/g, '')}`}>
              {lastRestOp.status}
            </span>
          </div>
        </div>
      </div>

      <main className="main-content">
        {/* Editorial Hero Section */}
        <section className="editorial-hero">
          <div className="hero-decor-wrapper" aria-hidden="true">
            <div className="passport-concentric-circle circle-top-right"></div>
            <div className="passport-concentric-circle circle-bottom-left"></div>
          </div>
          <div className="hero-inner">
            <p className="hero-eyebrow">A CURATED ARCHIVE TO PRESERVE GLOBAL CINEMA</p>
            <h2 className="hero-headline">
              Frame a vision. <br />
              <em>Preserve forever.</em>
            </h2>
            <p className="hero-deck">
              The timeless masterpieces people rewatch, the global stories that redefine the craft, and the cinematic heritage worth cataloging. Full RESTful CRUD operations powered by MockAPI.
            </p>
          </div>
        </section>

        {/* 2. Aggregate Statistics Panel */}
        <Stats movies={movies} />

        {/* 3. Search, Filter & Sort Controls */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          genres={availableGenres}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={processedMovies.length}
          totalMovies={movies.length}
          onResetFilters={handleResetFilters}
        />

        {/* 4. Movie Cards Grid with Loading / Error / Empty States */}
        <MovieGrid
          movies={processedMovies}
          isLoading={isLoading}
          error={error}
          onRetry={() => fetchMovies(false)}
          onEditMovie={handleOpenEditModal}
          onDeleteMovie={handleDeleteRequest}
          onAddNewMovie={handleOpenAddModal}
          searchTerm={searchTerm}
          selectedGenre={selectedGenre}
        />
      </main>

      {/* Footer with academic viva attribution */}
      <footer className="app-footer">
        <div className="footer-container">
          <p className="footer-text">
            <strong>CineVault</strong> – College Practical on Complete CRUD REST Operations (React + MockAPI)
          </p>
          <div className="crud-badge-group">
            <span className="crud-chip chip-get">GET (Read)</span>
            <span className="crud-chip chip-post">POST (Create)</span>
            <span className="crud-chip chip-put">PUT (Update)</span>
            <span className="crud-chip chip-delete">DELETE (Remove)</span>
          </div>
        </div>
      </footer>

      {/* 5. Create & Edit Movie Modal */}
      {isFormOpen && (
        <MovieForm
          key={movieToEdit ? `edit-${movieToEdit.id}` : 'create'}
          isOpen={isFormOpen}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
          movieToEdit={movieToEdit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* 6. Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(movieToDelete)}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        movie={movieToDelete}
        isDeleting={isDeleting}
      />

      {/* 7. Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
