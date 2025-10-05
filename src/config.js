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
 * 
 * Optional:
 * - NODE_ENV: Set automatically by React Scripts (development/production)
 * 
 * ENVIRONMENT FILES:
 * ------------------
 * Local Development (.env.local):
 *   REACT_APP_API_URL=http://localhost:3001
 *   REACT_APP_API_KEY=your-dev-api-key
 * 
 * Production (.env.production - set in Vercel):
 *   REACT_APP_API_URL=https://your-backend.onrender.com
 *   REACT_APP_API_KEY=your-production-api-key
 * 
 * USAGE:
 * ------
 * import config from './config';
 * 
 * console.log(config.API_URL);        // Backend URL
 * console.log(config.API_KEY);        // API key
 * console.log(config.isDevelopment);  // true/false
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
 * 
 * EXAMPLES:
 * ---------
 * Development:
 *   window.location.hostname = 'localhost'
 *   Returns: 'http://localhost:3001'
 * 
 * Production:
 *   process.env.REACT_APP_API_URL = 'https://backend.onrender.com'
 *   Returns: 'https://backend.onrender.com'
 * 
 * WARNING:
 * --------
 * In production, REACT_APP_API_URL MUST be set in Vercel environment variables.
 * If not set, the app will fall back to localhost (which won't work in production).
 */
const getApiUrl = () => {
  // Priority 1: Check environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Priority 2: Auto-detect based on hostname
  if (window.location.hostname === 'localhost') {
    // Local development - use local backend
    return 'http://localhost:3001';
  }

  // Production fallback - warn if not configured
  console.warn('⚠️ REACT_APP_API_URL not set. Using localhost as fallback.');
  console.warn('⚠️ This will NOT work in production!');
  console.warn('⚠️ Set REACT_APP_API_URL in Vercel environment variables.');
  return 'http://localhost:3001';
};

/**
 * ========================================================================
 * API KEY CONFIGURATION
 * ========================================================================
 * 
 * Retrieves the API authentication key from environment variables.
 * This key is sent in the X-API-Key header with every API request.
 * 
 * SECURITY:
 * ---------
 * - MUST match the API_KEY in backend .env file
 * - Different keys for development and production recommended
 * - Never commit API keys to git
 * - Rotate keys every 90 days
 * 
 * @returns {string|undefined} API authentication key
 * 
 * VALIDATION:
 * -----------
 * - Logs error if not set in production
 * - All API requests will fail without this key
 * - Backend returns 401 Unauthorized if key is missing/invalid
 * 
 * EXAMPLES:
 * ---------
 * Development:
 *   REACT_APP_API_KEY=dev-local-api-key-12345
 * 
 * Production:
 *   REACT_APP_API_KEY=prod-secure-32-char-key-here
 */
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  
  // Validate API key is set in production
  if (!apiKey && process.env.NODE_ENV === 'production') {
    console.error('❌ REACT_APP_API_KEY not set in production!');
    console.error('❌ All API requests will fail with 401 Unauthorized.');
    console.error('❌ Set REACT_APP_API_KEY in Vercel environment variables.');
    console.error('❌ API key must match backend API_KEY exactly.');
  }
  
  return apiKey;
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
 * - isDevelopment: True if running in development mode (boolean)
 * - isProduction: True if running in production mode (boolean)
 * - features: Feature flags for optional functionality (object)
 * 
 * FEATURE FLAGS:
 * --------------
 * - enableCalendar: Toggle Google Calendar integration (boolean)
 * - enableVoiceReservations: Toggle Retell AI voice bookings (boolean)
 * 
 * USAGE:
 * ------
 * import config from './config';
 * 
 * if (config.isDevelopment) {
 *   console.log('Running in development mode');
 * }
 * 
 * if (config.features.enableCalendar) {
 *   // Show calendar-related UI
 * }
 */
export const config = {
  // Backend API configuration
  API_URL: getApiUrl(),
  API_KEY: getApiKey(),
  
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Feature flags (can be controlled via env vars in future)
  features: {
    enableCalendar: true,           // Google Calendar integration
    enableVoiceReservations: true,  // Retell AI voice bookings
  },
};

/**
 * ========================================================================
 * DEVELOPMENT LOGGING
 * ========================================================================
 * 
 * Logs configuration to console in development mode for debugging.
 * Helps verify environment variables are loaded correctly.
 * 
 * LOGGED INFORMATION:
 * -------------------
 * - API URL (shows which backend will be used)
 * - API Key status (set or not set)
 * - Current environment (development/production)
 * 
 * SECURITY NOTE:
 * --------------
 * - Only logs in development (process.env.NODE_ENV === 'development')
 * - Does NOT log actual API key value (security)
 * - Only logs whether key is set or not
 */
if (config.isDevelopment) {
  console.log('🔧 Application Configuration:');
  console.log('  API URL:', config.API_URL);
  console.log('  API Key:', config.API_KEY ? '✅ Set' : '❌ Not set');
  console.log('  Environment:', process.env.NODE_ENV);
  console.log('  Features:', config.features);
}

/**
 * ========================================================================
 * PRODUCTION VALIDATION
 * ========================================================================
 * 
 * Validates critical configuration in production.
 * Logs warnings if configuration appears incorrect.
 * 
 * CHECKS:
 * -------
 * - API URL should not be localhost in production
 * - API key should be set in production
 * - API URL should use HTTPS in production
 */
if (config.isProduction) {
  // Check 1: API URL should not be localhost in production
  if (config.API_URL.includes('localhost')) {
    console.error('❌ PRODUCTION ERROR: API_URL is set to localhost!');
    console.error('❌ This will not work in production.');
    console.error('❌ Update REACT_APP_API_URL in Vercel to your backend URL.');
  }

  // Check 2: API URL should use HTTPS in production
  if (!config.API_URL.startsWith('https://')) {
    console.warn('⚠️ WARNING: API_URL is not using HTTPS in production.');
    console.warn('⚠️ This is insecure and may not work on Vercel.');
    console.warn('⚠️ Backend URL should start with https://');
  }

  // Check 3: API key should be set
  if (!config.API_KEY) {
    console.error('❌ PRODUCTION ERROR: API_KEY is not set!');
    console.error('❌ All API requests will fail.');
  }
}

/**
 * ========================================================================
 * DEFAULT EXPORT
 * ========================================================================
 * 
 * Exports the configuration object as default export.
 * Also exports as named export for flexibility.
 * 
 * IMPORT OPTIONS:
 * ---------------
 * Default import (recommended):
 *   import config from './config';
 * 
 * Named import:
 *   import { config } from './config';
 * 
 * Destructured import:
 *   import { config } from './config';
 *   const { API_URL, API_KEY } = config;
 */
export default config;

/**
 * ============================================================================
 * TROUBLESHOOTING
 * ============================================================================
 * 
 * ISSUE: "API_KEY not set" warning in console
 * SOLUTION:
 *   - Create .env.local file in frontend root
 *   - Add: REACT_APP_API_KEY=your-key-here
 *   - Restart frontend: npm start
 * 
 * ISSUE: "CORS error" when calling API
 * SOLUTION:
 *   - Verify REACT_APP_API_URL is correct
 *   - Check backend FRONTEND_URL matches your frontend URL
 *   - Restart backend after changing .env
 * 
 * ISSUE: "401 Unauthorized" on all API calls
 * SOLUTION:
 *   - Verify REACT_APP_API_KEY matches backend API_KEY exactly
 *   - Check browser DevTools → Network → Request Headers → X-API-Key
 *   - API keys are case-sensitive
 * 
 * ISSUE: Configuration not updating
 * SOLUTION:
 *   - Stop frontend (Ctrl+C)
 *   - Delete .env.local
 *   - Recreate .env.local with correct values
 *   - npm start
 *   - Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
 * 
 * ISSUE: "localhost" used in production
 * SOLUTION:
 *   - Go to Vercel dashboard
 *   - Settings → Environment Variables
 *   - Add REACT_APP_API_URL with your backend URL
 *   - Redeploy frontend
 * 
 * ============================================================================
 * END OF CONFIGURATION
 * ============================================================================
 */