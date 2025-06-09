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

/**
 * Internal: fetch API key from environment, with robust developer-facing warnings.
 * Never hardcodes a key. Only uses process.env.REACT_APP_TMDB_API_KEY at build time.
 */
function getTmdbApiKey() {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey || apiKey === "CHANGEME" || apiKey.trim() === "") {
    // Log error for developers in the console.
    if (typeof window !== "undefined" && window.console && window.console.error) {
      window.console.error(
        "[Kollywood QuizMaster] ERROR: The TMDb API key is missing!\n" +
        "Please create a .env file with REACT_APP_TMDB_API_KEY set. " +
        "You may need to restart the development server after setting/changing .env.\n" +
        "Refer to .env.example and README.md for instructions."
      );
    }
    throw new Error(
      "TMDb API key is not set in environment variables. Please set REACT_APP_TMDB_API_KEY in your .env file (see .env.example and README!)."
    );
  }
  return apiKey;
}

/**
 * Fetches popular Tamil (Kollywood) movies from TMDb.
 * Tamil language code: "ta"
 * @param {number} page - Pagination for results
 *   - Page 1: most popular
 *   - Pages 2-4: still popular, but more moderate
 * @returns {Promise<object>} Response JSON
 */
export async function fetchPopularTamilMovies(page = 1) {
  const apiKey = getTmdbApiKey();
  const url =
    `${TMDB_BASE_URL}/discover/movie?` +
    `api_key=${apiKey}` +
    `&with_original_language=ta` +
    `&sort_by=popularity.desc` +  // Most popular to less popular as pages increase
    `&page=${page}` +
    `&adult=false`; // Only fetch non-adult movies

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.statusText}`);
  }
  const data = await response.json();
  // Extra safeguard: remove any accidental adult:true movies (in case TMDb includes them unexpectedly)
  if (data.results && Array.isArray(data.results)) {
    data.results = data.results.filter(movie => movie.adult === false);
  }
  return data;
}

// PUBLIC_INTERFACE
/**
 * Fetches LESS popular (harder) Tamil movies from TMDb for challenging quizzes.
 * Sorted by LOWER popularity (so, more niche/obscure/older).
 * @param {number} page - Pagination offset for obscurity (higher=less popular)
 * @returns {Promise<object>} Response JSON
 */
export async function fetchObscureTamilMovies(page = 1) {
  const apiKey = getTmdbApiKey();
  // Use sort_by=popularity.asc to get LEAST popular!
  const url =
    `${TMDB_BASE_URL}/discover/movie?` +
    `api_key=${apiKey}` +
    `&with_original_language=ta` +
    `&sort_by=popularity.asc` +
    // Without a vote_count filter, will get unvoted films. Add min vote threshold for some quality:
    `&vote_count.gte=5` +
    `&page=${page}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Fetches cast/credits for a specific movie from TMDb.
 * @param {number|string} movieId - The TMDb movie ID
 * @returns {Promise<object>} The credits response object (with 'cast' array)
 */
// PUBLIC_INTERFACE
export async function fetchMovieCredits(movieId) {
  const apiKey = getTmdbApiKey();
  const url = `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${apiKey}&language=ta`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDb API error (credits): ${response.statusText}`);
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
