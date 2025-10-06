/**
 * ============================================================================
 * APPLICATION CONFIGURATION - PRODUCTION READY
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
 * - REACT_APP_RESERVATION_PHONE: Phone number for reservations
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

const getApiKey = () => {
  const apiKey = process.env.REACT_APP_API_KEY;

  if (!apiKey && process.env.NODE_ENV === "production") {
    console.error("❌ REACT_APP_API_KEY not set in production!");
    console.error("❌ All API requests will fail with 401 Unauthorized.");
    console.error("❌ Set REACT_APP_API_KEY in Vercel environment variables.");
    console.error("❌ API key must match backend API_KEY exactly.");
  }

  return apiKey;
};

/**
 * Get reservation phone number from environment
 * Falls back to default if not set
 */
const getReservationPhone = () => {
  const phone = process.env.REACT_APP_RESERVATION_PHONE;

  if (!phone) {
    console.warn("⚠️ REACT_APP_RESERVATION_PHONE not set. Using default.");
    return "+1(667)327-1604"; // Default fallback
  }

  return phone;
};

export const config = {
  // Backend API configuration
  API_URL: getApiUrl(),
  API_KEY: getApiKey(),

  // Restaurant contact information
  RESERVATION_PHONE: getReservationPhone(),

  // Environment detection
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Feature flags
  features: {
    enableCalendar: true,
    enableVoiceReservations: true,
  },
};

// Development logging
if (config.isDevelopment) {
  console.log("🔧 Application Configuration:");
  console.log("  API URL:", config.API_URL);
  console.log("  API Key:", config.API_KEY ? "✅ Set" : "❌ Not set");
  console.log("  Phone:", config.RESERVATION_PHONE);
  console.log("  Environment:", process.env.NODE_ENV);
  console.log("  Features:", config.features);
}

// Production validation
if (config.isProduction) {
  if (config.API_URL.includes("localhost")) {
    console.error("❌ PRODUCTION ERROR: API_URL is set to localhost!");
    console.error("❌ This will not work in production.");
    console.error("❌ Update REACT_APP_API_URL in Vercel to your backend URL.");
  }

  if (!config.API_URL.startsWith("https://")) {
    console.warn("⚠️ WARNING: API_URL is not using HTTPS in production.");
    console.warn("⚠️ This is insecure and may not work on Vercel.");
    console.warn("⚠️ Backend URL should start with https://");
  }

  if (!config.API_KEY) {
    console.error("❌ PRODUCTION ERROR: API_KEY is not set!");
    console.error("❌ All API requests will fail.");
  }
}

export default config;
