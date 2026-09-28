import axios from 'axios';
import { getDiverseSampleBatch, WORLD_CINEMA_DATASET } from '../data/worldCinemaDataset';

// MockAPI base endpoint for movies resource
const BASE_URL = 'https://6aba51f75b549d818d624667.mockapi.io/api/v1/movies';

// Create an Axios instance with timeout and JSON headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Movie API Service
 * Centralizes all HTTP CRUD operations against MockAPI.
 * Easy to explain in viva: Each method maps directly to a REST verb (GET, POST, PUT, DELETE).
 */
export const movieService = {
  /**
   * READ ALL: GET /movies
   * Fetches the complete list of movies from MockAPI
   */
  getAllMovies: async () => {
    try {
      const response = await apiClient.get('');
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error(error.response?.data || 'Failed to fetch movies from server.');
    }
  },

  /**
   * READ ONE: GET /movies/:id
   * Fetches a single movie by its MockAPI generated id
   */
  getMovieById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie id ${id}:`, error);
      throw new Error(error.response?.data || `Failed to fetch movie with ID: ${id}`);
    }
  },

  /**
   * CREATE: POST /movies
   * Creates a new movie record in MockAPI
   * MockAPI automatically generates 'id' and 'createdAt'
   */
  createMovie: async (movieData) => {
    try {
      // Ensure numeric types are properly formatted as numbers
      const payload = {
        title: movieData.title.trim(),
        genre: movieData.genre.trim(),
        year: Number(movieData.year),
        rating: Number(movieData.rating),
        language: movieData.language.trim(),
        posterUrl: movieData.posterUrl ? movieData.posterUrl.trim() : '',
        views: Number(movieData.views || 0),
      };
      const response = await apiClient.post('', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw new Error(error.response?.data || 'Failed to create movie. Please try again.');
    }
  },

  /**
   * UPDATE: PUT /movies/:id
   * Updates an existing movie record in MockAPI by id
   */
  updateMovie: async (id, movieData) => {
    try {
      const payload = {
        title: movieData.title.trim(),
        genre: movieData.genre.trim(),
        year: Number(movieData.year),
        rating: Number(movieData.rating),
        language: movieData.language.trim(),
        posterUrl: movieData.posterUrl ? movieData.posterUrl.trim() : '',
        views: Number(movieData.views || 0),
      };
      const response = await apiClient.put(`/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating movie id ${id}:`, error);
      throw new Error(error.response?.data || 'Failed to update movie. Please try again.');
    }
  },

  /**
   * DELETE: DELETE /movies/:id
   * Removes a movie record from MockAPI by id
   */
  deleteMovie: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting movie id ${id}:`, error);
      throw new Error(error.response?.data || 'Failed to delete movie. Please try again.');
    }
  },

  /**
   * SAMPLE DATA SEEDER:
   * Dynamically adds a new, varied batch of world cinema titles across the globe
   * (Japan, Korea, France, Italy, India, Spain, Denmark, Germany, Hong Kong, etc.).
   * Filters out movies already present in MockAPI so every click yields fresh titles!
   */
  createSampleMovies: async (existingMovies = [], count = 4) => {
    const batch = getDiverseSampleBatch(existingMovies, count);
    const results = [];
    for (const movie of batch) {
      const created = await apiClient.post('', movie);
      results.push(created.data);
    }
    return results;
  },

  /**
   * Direct access to the dataset
   */
  getWorldDataset: () => WORLD_CINEMA_DATASET,
};

export default movieService;
