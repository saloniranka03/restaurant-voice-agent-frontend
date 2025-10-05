/**
 * ============================================================================
 * APPLICATION CONFIGURATION
 * ============================================================================
 *
 * Centralizes environment-based configuration for the frontend application.
 * Automatically switches between local development and production environments.
 *
 * PURPOSE:
 * --------
 * - Provides single source of truth for configuration
 * - Auto-detects environment (development vs production)
 * - Validates required environment variables
 * - Logs configuration in development for debugging
 *
 * ENVIRONMENT VARIABLES (from .env files):
 * ----------------------
 * React only reads variables that start with REACT_APP_
 *
 * Required:
 * - REACT_APP_API_URL: Backend API base URL
 * - REACT_APP_API_KEY: API authentication key
 *
 * Optional:
 * - REACT_APP_RESERVATION_PHONE: Phone number for voice reservations
 * - NODE_ENV: Set automatically by React Scripts (development/production)
 *
 * ENVIRONMENT FILES:
 * ------------------
 * Local Development (.env.local):
 *   REACT_APP_API_URL=http://localhost:3001
 *   REACT_APP_API_KEY=your-dev-api-key
 *   REACT_APP_RESERVATION_PHONE=+1(667)327-1604
 *
 * Production (.env.production - set in Vercel):
 *   REACT_APP_API_URL=https://your-backend.onrender.com
 *   REACT_APP_API_KEY=your-production-api-key
 *   REACT_APP_RESERVATION_PHONE=+1(667)327-1604
 *
 * USAGE:
 * ------
 * import config from './config';
 *
 * console.log(config.API_URL);              // Backend URL
 * console.log(config.API_KEY);              // API key
 * console.log(config.RESERVATION_PHONE);    // Phone number for reservations
 * console.log(config.isDevelopment);        // true/false
 *
 * @module config
 */

/**
 * ========================================================================
 * API URL CONFIGURATION
 * ========================================================================
 *
 * Determines the backend API URL based on environment.
 *
 * PRIORITY (in order):
 * 1. REACT_APP_API_URL environment variable (highest priority)
 * 2. Auto-detect based on hostname:
 *    - localhost → http://localhost:3001 (local backend)
 *    - production domain → requires REACT_APP_API_URL to be set
 *
 * @returns {string} Backend API base URL
 */
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (window.location.hostname === "localhost") {
    return "http://localhost:3001";
  }

  console.warn("⚠️ REACT_APP_API_URL not set. Using localhost as fallback.");
  console.warn("⚠️ This will NOT work in production!");
  console.warn("⚠️ Set REACT_APP_API_URL in Vercel environment variables.");
  return "http://localhost:3001";
};

/**
 * ========================================================================
 * API KEY CONFIGURATION
 * ========================================================================
 *
 * Retrieves the API authentication key from environment variables.
 * This key is sent in the X-API-Key header with every API request.
 *
 * @returns {string|undefined} API authentication key
 */
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_API_KEY;

  if (!apiKey && process.env.NODE_ENV === "production") {
    console.error("❌ REACT_APP_API_KEY not set in production!");
    console.error("❌ All API requests will fail with 401 Unauthorized.");
    console.error("❌ Set REACT_APP_API_KEY in Vercel environment variables.");
  }

  return apiKey;
};

/**
 * ========================================================================
 * RESERVATION PHONE NUMBER CONFIGURATION
 * ========================================================================
 *
 * Retrieves the phone number for voice reservations from environment variables.
 * This allows easy updates without code changes.
 *
 * DEFAULT: +1(667)327-1604
 *
 * To change the phone number:
 * 1. Update REACT_APP_RESERVATION_PHONE in .env.local (development)
 * 2. Update REACT_APP_RESERVATION_PHONE in Vercel (production)
 * 3. Redeploy frontend (Vercel auto-deploys on env change)
 *
 * @returns {string} Phone number for voice reservations
 */
const getReservationPhone = () => {
  return process.env.REACT_APP_RESERVATION_PHONE || "+1(667)327-1604";
};

/**
 * ========================================================================
 * CONFIGURATION OBJECT
 * ========================================================================
 *
 * Main configuration export containing all application settings.
 *
 * PROPERTIES:
 * -----------
 * - API_URL: Backend API base URL (string)
 * - API_KEY: API authentication key (string|undefined)
 * - RESERVATION_PHONE: Phone number for voice reservations (string)
 * - isDevelopment: True if running in development mode (boolean)
 * - isProduction: True if running in production mode (boolean)
 * - features: Feature flags for optional functionality (object)
 */
export const config = {
  // Backend API configuration
  API_URL: getApiUrl(),
  API_KEY: getApiKey(),

  // Voice reservation phone number
  RESERVATION_PHONE: getReservationPhone(),

  // Environment detection
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Feature flags
  features: {
    enableCalendar: true, // Google Calendar integration
    enableVoiceReservations: true, // Retell AI voice bookings
  },
};

/**
 * ========================================================================
 * DEVELOPMENT LOGGING
 * ========================================================================
 */
if (config.isDevelopment) {
  console.log("🔧 Application Configuration:");
  console.log("  API URL:", config.API_URL);
  console.log("  API Key:", config.API_KEY ? "✅ Set" : "❌ Not set");
  console.log("  Reservation Phone:", config.RESERVATION_PHONE);
  console.log("  Environment:", process.env.NODE_ENV);
  console.log("  Features:", config.features);
}

/**
 * ========================================================================
 * PRODUCTION VALIDATION
 * ========================================================================
 */
if (config.isProduction) {
  if (config.API_URL.includes("localhost")) {
    console.error("❌ PRODUCTION ERROR: API_URL is set to localhost!");
  }

  if (!config.API_URL.startsWith("https://")) {
    console.warn("⚠️ WARNING: API_URL is not using HTTPS in production.");
  }

  if (!config.API_KEY) {
    console.error("❌ PRODUCTION ERROR: API_KEY is not set!");
  }
}

export default config;
