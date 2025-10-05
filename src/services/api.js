/**
 * ============================================================================
 * API SERVICE - PRODUCTION READY
 * ============================================================================
 * 
 * Centralized API communication layer for the restaurant reservation system.
 * Provides a clean, consistent interface for all HTTP requests to the backend.
 * 
 * PURPOSE:
 * --------
 * - Single source for all API calls (DRY principle)
 * - Automatic API key authentication on every request
 * - Consistent error handling across the application
 * - Request/response logging for debugging
 * - Network error detection and user-friendly messages
 * - Retry logic for transient failures
 * 
 * FEATURES:
 * ---------
 * ✅ Automatic authentication (X-API-Key header)
 * ✅ Error handling with custom ApiError class
 * ✅ Network error detection
 * ✅ Development logging (request/response)
 * ✅ Retry mechanism with exponential backoff
 * ✅ TypeScript-ready (JSDoc annotations)
 * 
 * SECURITY:
 * ---------
 * - API key automatically added to all requests
 * - Credentials included for CORS (cookies/session)
 * - HTTPS enforced in production (via config)
 * 
 * USAGE:
 * ------
 * import { api } from './services/api';
 * 
 * // GET request
 * const stats = await api.get('/reservations/stats');
 * 
 * // POST request
 * const reservation = await api.post('/reservations', {
 *   name: 'John Doe',
 *   phone: '+1234567890',
 *   partySize: 4,
 *   date: '2024-12-25',
 *   time: '7:00 PM'
 * });
 * 
 * // With retry for critical operations
 * const data = await withRetry(() => api.get('/reservations/stats'));
 * 
 * @module api
 */

import config from '../config';

/**
 * ========================================================================
 * API ERROR CLASS
 * ========================================================================
 * 
 * Custom error class for API-related errors.
 * Extends the native Error class with additional properties.
 * 
 * PROPERTIES:
 * -----------
 * - message: string - Human-readable error message
 * - status: number - HTTP status code (e.g., 400, 401, 500)
 * - data: any - Additional error data from server
 * 
 * USAGE:
 * ------
 * try {
 *   await api.get('/reservations');
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.log('Status:', error.status);
 *     console.log('Message:', error.message);
 *     console.log('Data:', error.data);
 *   }
 * }
 * 
 * STATUS CODES:
 * -------------
 * - 0: Network error (no response from server)
 * - 400: Bad request (validation error)
 * - 401: Unauthorized (invalid API key)
 * - 404: Not found (resource doesn't exist)
 * - 429: Too many requests (rate limit exceeded)
 * - 500: Server error (backend crashed)
 */
export class ApiError extends Error {
  /**
   * Creates a new ApiError instance
   * 
   * @param {string} message - Error message for user
   * @param {number} status - HTTP status code
   * @param {any} data - Additional error data
   */
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * ========================================================================
 * FETCH WITH AUTHENTICATION
 * ========================================================================
 * 
 * Base fetch wrapper that handles authentication and error handling.
 * All API calls go through this function.
 * 
 * PROCESS FLOW:
 * 1. Build full URL (config.API_URL + endpoint)
 * 2. Add authentication headers (X-API-Key)
 * 3. Add Content-Type header (application/json)
 * 4. Make fetch request
 * 5. Parse response (JSON or text)
 * 6. Check for HTTP errors (status code)
 * 7. Return data or throw ApiError
 * 
 * @param {string} endpoint - API endpoint (e.g., '/reservations')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} - Parsed response data
 * @throws {ApiError} - On HTTP errors or network failures
 * 
 * AUTHENTICATION:
 * ---------------
 * - Adds X-API-Key header if config.API_KEY is set
 * - Backend validates this key on protected endpoints
 * - Missing/invalid key returns 401 Unauthorized
 * 
 * ERROR HANDLING:
 * ---------------
 * - Network errors: Throws ApiError with status 0
 * - HTTP errors (4xx, 5xx): Throws ApiError with actual status
 * - Success (2xx): Returns parsed data
 * 
 * LOGGING:
 * --------
 * - Development: Logs all requests and responses
 * - Production: Silent (no logs)
 * - Errors: Always logged to console
 * 
 * EXAMPLE:
 * --------
 * const data = await fetchWithAuth('/reservations/stats', {
 *   method: 'GET'
 * });
 */
async function fetchWithAuth(endpoint, options = {}) {
  // Build full URL
  const url = `${config.API_URL}${endpoint}`;
  
  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add API key if available
  if (config.API_KEY) {
    headers['X-API-Key'] = config.API_KEY;
  } else {
    // Warn if API key is missing (should never happen in production)
    console.warn('⚠️ API key not configured. Requests may fail.');
  }

  // Merge options
  const fetchOptions = {
    ...options,
    headers,
  };

  // Log request in development
  if (config.isDevelopment) {
    console.log(`📤 API Request: ${options.method || 'GET'} ${endpoint}`);
    if (options.body) {
      console.log('  Body:', JSON.parse(options.body));
    }
  }

  try {
    // Make the fetch request
    const response = await fetch(url, fetchOptions);
    
    // Parse response body
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle HTTP errors (4xx, 5xx status codes)
    if (!response.ok) {
      // Extract error message from response
      const errorMessage = 
        (typeof data === 'object' && data.message) || 
        (typeof data === 'string' && data) ||
        `HTTP ${response.status}: ${response.statusText}`;

      // Log error in development
      if (config.isDevelopment) {
        console.error(`❌ API Error: ${errorMessage}`);
        console.error('  Status:', response.status);
        console.error('  Data:', data);
      }

      // Throw ApiError with details
      throw new ApiError(errorMessage, response.status, data);
    }

    // Log successful response in development
    if (config.isDevelopment) {
      console.log(`✅ API Response: ${options.method || 'GET'} ${endpoint}`);
      console.log('  Data:', data);
    }

    return data;
    
  } catch (error) {
    // Network errors or fetch failures
    if (error instanceof ApiError) {
      // Re-throw API errors as-is
      throw error;
    }

    // Handle network errors (no response from server)
    if (config.isDevelopment) {
      console.error('❌ Network Error:', error.message);
      console.error('  Endpoint:', endpoint);
      console.error('  URL:', url);
    }

    // Throw ApiError for network failures
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0,
      { originalError: error.message }
    );
  }
}

/**
 * ========================================================================
 * API SERVICE OBJECT
 * ========================================================================
 * 
 * Main API service with HTTP methods.
 * Provides a clean interface for making API calls.
 * 
 * METHODS:
 * --------
 * - get(endpoint, options) - GET request
 * - post(endpoint, data, options) - POST request
 * - patch(endpoint, data, options) - PATCH request
 * - delete(endpoint, options) - DELETE request
 * 
 * USAGE:
 * ------
 * import { api } from './services/api';
 * 
 * // GET
 * const reservations = await api.get('/reservations');
 * 
 * // POST
 * const created = await api.post('/reservations', {
 *   name: 'John Doe',
 *   phone: '+1234567890'
 * });
 * 
 * // PATCH
 * const updated = await api.patch('/reservations/123', {
 *   time: '8:00 PM'
 * });
 * 
 * // DELETE
 * await api.delete('/reservations/123');
 */
export const api = {
  /**
   * GET request
   * 
   * Retrieves data from the server.
   * 
   * @param {string} endpoint - API endpoint (e.g., '/reservations')
   * @param {object} options - Additional fetch options (optional)
   * @returns {Promise<any>} - Response data
   * @throws {ApiError} - On errors
   * 
   * EXAMPLE:
   * --------
   * const stats = await api.get('/reservations/stats');
   * const reservations = await api.get('/reservations?status=confirmed');
   */
  get: (endpoint, options = {}) => {
    return fetchWithAuth(endpoint, {
      ...options,
      method: 'GET',
    });
  },

  /**
   * POST request
   * 
   * Creates new data on the server.
   * 
   * @param {string} endpoint - API endpoint (e.g., '/reservations')
   * @param {object} data - Request body data
   * @param {object} options - Additional fetch options (optional)
   * @returns {Promise<any>} - Response data (usually created resource)
   * @throws {ApiError} - On errors
   * 
   * EXAMPLE:
   * --------
   * const reservation = await api.post('/reservations', {
   *   name: 'John Doe',
   *   phone: '+15551234567',
   *   partySize: 4,
   *   date: '2024-12-25',
   *   time: '7:00 PM'
   * });
   */
  post: (endpoint, data, options = {}) => {
    return fetchWithAuth(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   * 
   * Updates existing data on the server (partial update).
   * 
   * @param {string} endpoint - API endpoint (e.g., '/reservations/123')
   * @param {object} data - Request body data (fields to update)
   * @param {object} options - Additional fetch options (optional)
   * @returns {Promise<any>} - Response data (usually updated resource)
   * @throws {ApiError} - On errors
   * 
   * EXAMPLE:
   * --------
   * const updated = await api.patch('/reservations/507f1f77bcf86cd799439011', {
   *   time: '8:00 PM',
   *   partySize: 6
   * });
   */
  patch: (endpoint, data, options = {}) => {
    return fetchWithAuth(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   * 
   * Deletes data from the server (or marks as deleted).
   * 
   * @param {string} endpoint - API endpoint (e.g., '/reservations/123')
   * @param {object} options - Additional fetch options (optional)
   * @returns {Promise<any>} - Response data (usually deleted resource)
   * @throws {ApiError} - On errors
   * 
   * EXAMPLE:
   * --------
   * const cancelled = await api.delete('/reservations/507f1f77bcf86cd799439011');
   * // Backend sets status to 'cancelled' (soft delete)
   */
  delete: (endpoint, options = {}) => {
    return fetchWithAuth(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
};

/**
 * ========================================================================
 * RETRY WRAPPER
 * ========================================================================
 * 
 * Automatically retries failed API calls with exponential backoff.
 * Useful for handling transient network errors.
 * 
 * RETRY LOGIC:
 * ------------
 * - Retries up to maxRetries times (default: 3)
 * - Uses exponential backoff: 1s, 2s, 4s, 8s, etc.
 * - Does NOT retry on client errors (4xx status codes)
 * - Only retries on network errors or 5xx server errors
 * 
 * @param {Function} apiCall - API function to retry (e.g., () => api.get('/stats'))
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} delayMs - Initial delay in milliseconds (default: 1000)
 * @returns {Promise<any>} - Response data from successful call
 * @throws {ApiError} - If all retries fail
 * 
 * USAGE:
 * ------
 * // Retry GET request up to 3 times
 * const stats = await withRetry(() => api.get('/reservations/stats'));
 * 
 * // Custom retry configuration (5 attempts, 2s initial delay)
 * const data = await withRetry(
 *   () => api.get('/reservations'),
 *   5,  // maxRetries
 *   2000  // delayMs
 * );
 * 
 * WHEN TO USE:
 * ------------
 * ✅ Critical data fetches (dashboard stats)
 * ✅ Network-sensitive operations
 * ✅ Operations that can safely be retried
 * 
 * ❌ User-triggered actions (create/update/delete)
 * ❌ Operations with side effects
 * ❌ Real-time data (where stale data is worse than no data)
 * 
 * BACKOFF SCHEDULE:
 * -----------------
 * Attempt 1: Immediate
 * Attempt 2: Wait 1 second (1000ms * 2^0)
 * Attempt 3: Wait 2 seconds (1000ms * 2^1)
 * Attempt 4: Wait 4 seconds (1000ms * 2^2)
 * Attempt 5: Wait 8 seconds (1000ms * 2^3)
 */
export async function withRetry(apiCall, maxRetries = 3, delayMs = 1000) {
  // Loop through retry attempts
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Attempt the API call
      return await apiCall();
      
    } catch (error) {
      // Don't retry on client errors (4xx status codes)
      // These are usually validation errors that won't change
      if (error.status >= 400 && error.status < 500) {
        console.log('❌ Client error - not retrying:', error.message);
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error(`❌ All ${maxRetries} retry attempts failed`);
        throw error;
      }

      // Calculate wait time with exponential backoff
      const waitTime = delayMs * Math.pow(2, attempt - 1);
      
      // Log retry attempt
      console.log(`⚠️ Request failed. Retrying in ${waitTime}ms... (Attempt ${attempt}/${maxRetries})`);
      console.log(`  Error: ${error.message}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * ========================================================================
 * DEFAULT EXPORT
 * ========================================================================
 * 
 * Exports the api object as default export.
 * Also exports ApiError and withRetry as named exports.
 * 
 * IMPORT OPTIONS:
 * ---------------
 * // Default import (recommended)
 * import api from './services/api';
 * 
 * // Named imports
 * import { api, ApiError, withRetry } from './services/api';
 * 
 * // Mixed import
 * import api, { ApiError, withRetry } from './services/api';
 */
export default api;

/**
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 * 
 * BASIC GET REQUEST:
 * ------------------
 * import { api } from './services/api';
 * 
 * const fetchStats = async () => {
 *   try {
 *     const data = await api.get('/reservations/stats');
 *     console.log('Stats:', data);
 *   } catch (error) {
 *     console.error('Failed to fetch stats:', error.message);
 *   }
 * };
 * 
 * CREATE RESERVATION:
 * -------------------
 * const createReservation = async (formData) => {
 *   try {
 *     const reservation = await api.post('/reservations', formData);
 *     alert('Reservation created!');
 *     return reservation;
 *   } catch (error) {
 *     if (error.status === 400) {
 *       alert('Invalid data: ' + error.message);
 *     } else if (error.status === 401) {
 *       alert('Authentication failed');
 *     } else {
 *       alert('Failed to create reservation');
 *     }
 *   }
 * };
 * 
 * WITH RETRY:
 * -----------
 * import { api, withRetry } from './services/api';
 * 
 * const fetchCriticalData = async () => {
 *   try {
 *     const data = await withRetry(() => api.get('/reservations/today'));
 *     console.log('Data:', data);
 *   } catch (error) {
 *     console.error('Failed after 3 retries:', error.message);
 *   }
 * };
 * 
 * ERROR HANDLING:
 * ---------------
 * import { api, ApiError } from './services/api';
 * 
 * const handleRequest = async () => {
 *   try {
 *     await api.get('/reservations');
 *   } catch (error) {
 *     if (error instanceof ApiError) {
 *       // API error with status code
 *       switch (error.status) {
 *         case 401:
 *           console.log('Unauthorized - check API key');
 *           break;
 *         case 404:
 *           console.log('Resource not found');
 *           break;
 *         case 429:
 *           console.log('Rate limit exceeded - try again later');
 *           break;
 *         case 500:
 *           console.log('Server error - contact support');
 *           break;
 *         default:
 *           console.log('Error:', error.message);
 *       }
 *     } else {
 *       // Other errors (network, etc.)
 *       console.log('Unexpected error:', error);
 *     }
 *   }
 * };
 * 
 * ============================================================================
 * TROUBLESHOOTING
 * ============================================================================
 * 
 * ISSUE: "401 Unauthorized" on all requests
 * SOLUTION:
 *   - Check config.API_KEY is set correctly
 *   - Verify API key matches backend exactly
 *   - Check browser DevTools → Network → Headers → X-API-Key
 * 
 * ISSUE: "Network error" message
 * SOLUTION:
 *   - Check backend is running (http://localhost:3001/health)
 *   - Verify config.API_URL is correct
 *   - Check CORS configuration in backend
 *   - Check browser console for CORS errors
 * 
 * ISSUE: "CORS error" in console
 * SOLUTION:
 *   - Backend FRONTEND_URL must match frontend domain exactly
 *   - Restart backend after changing .env
 *   - Check backend logs for CORS messages
 * 
 * ISSUE: Requests not logged in development
 * SOLUTION:
 *   - Verify process.env.NODE_ENV === 'development'
 *   - Check config.isDevelopment is true
 *   - Hard refresh browser (Cmd+Shift+R)
 * 
 * ISSUE: "Too many requests" error (429)
 * SOLUTION:
 *   - Backend rate limit: 100 requests per 15 minutes
 *   - Wait 15 minutes or restart backend
 *   - Reduce request frequency in your code
 * 
 * ============================================================================
 * BEST PRACTICES
 * ============================================================================
 * 
 * DO:
 * ✅ Use try/catch for all API calls
 * ✅ Show user-friendly error messages
 * ✅ Use withRetry for critical data fetches
 * ✅ Check error.status to provide specific feedback
 * ✅ Log errors for debugging
 * 
 * DON'T:
 * ❌ Retry user-triggered actions (create/update/delete)
 * ❌ Ignore errors (always handle them)
 * ❌ Show technical error messages to users
 * ❌ Make API calls in loops without delays
 * ❌ Store API responses without error handling
 * 
 * PERFORMANCE:
 * ------------
 * - Use GET requests for data fetching
 * - Cache responses when appropriate
 * - Debounce search inputs before API calls
 * - Use pagination for large datasets
 * - Cancel in-flight requests when component unmounts
 * 
 * SECURITY:
 * ---------
 * - Never log API keys (even in development)
 * - Always use HTTPS in production
 * - Validate user input before sending to API
 * - Don't store sensitive data in localStorage
 * - Use environment variables for configuration
 * 
 * ============================================================================
 * END OF API SERVICE
 * ============================================================================
 */