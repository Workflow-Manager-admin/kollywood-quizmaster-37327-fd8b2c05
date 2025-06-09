/**
 * TMDb API utility for Kollywood QuizMaster.
 * Handles requests to TMDb API using the "REACT_APP_TMDB_API_KEY" environment variable.
 */

// PUBLIC_INTERFACE
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// PUBLIC_INTERFACE
export async function fetchPopularTamilMovies(page = 1) {
  /**
   * Fetches popular Tamil (Kollywood) movies from TMDb.
   * Tamil language code: "ta"
   * @param {number} page - Pagination for results
   * @returns {Promise<object>} Response JSON
   */
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDb API key is not set in environment variables.");
  }

  // Using discover/movie with language=ta and with_original_language=ta (Tamil)
  const url =
    `${TMDB_BASE_URL}/discover/movie?` +
    `api_key=${apiKey}` +
    `&with_original_language=ta` +
    `&sort_by=popularity.desc` +
    `&page=${page}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.statusText}`);
  }

  return await response.json();
}

// PUBLIC_INTERFACE
export async function fetchMovieDetails(movieId) {
  /**
   * Fetches details for a specific movie.
   * @param {number} movieId - The TMDb movie ID
   */
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDb API key is not set in environment variables.");
  }

  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}&language=ta`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.statusText}`);
  }

  return await response.json();
}
