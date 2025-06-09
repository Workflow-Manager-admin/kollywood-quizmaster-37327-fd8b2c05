/**
 * TMDb API utility for Kollywood QuizMaster.
 * Handles requests to TMDb API using the "REACT_APP_TMDB_API_KEY" environment variable.
 *
 * API KEY management:
 * - The TMDb API key MUST be placed in the .env file as: REACT_APP_TMDB_API_KEY
 * - For deployment/testing/demo: Use the example value below or your provided key.
 * - All fetches reference process.env.REACT_APP_TMDB_API_KEY only (never hardcode in source).
 * 
 * Example .env entry:
 *   REACT_APP_TMDB_API_KEY=5bc67d3b06aecbd18121a3cbbc16eb59
 *
 * If this key is missing, an error is thrown.
 */

// PUBLIC_INTERFACE
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Internal: fetch API key from environment
function getTmdbApiKey() {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey || apiKey === "CHANGEME" || apiKey.trim() === "") {
    throw new Error(
      "TMDb API key is not set in environment variables (.env, env, or deployment config). Please set REACT_APP_TMDB_API_KEY."
    );
  }
  return apiKey;
}

// PUBLIC_INTERFACE
export async function fetchPopularTamilMovies(page = 1) {
  /**
   * Fetches popular Tamil (Kollywood) movies from TMDb.
   * Tamil language code: "ta"
   * @param {number} page - Pagination for results
   * @returns {Promise<object>} Response JSON
   */
  const apiKey = getTmdbApiKey();

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
  const apiKey = getTmdbApiKey();
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}&language=ta`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.statusText}`);
  }

  return await response.json();
}
