/**
 * ============================================================================
 * MAIN APPLICATION COMPONENT - RESTAURANT RESERVATION DASHBOARD
 * ============================================================================
 * 
 * This is the primary component for Chaat Corner's reservation management system.
 * Provides a complete interface for restaurant staff to manage bookings.
 * 
 * FEATURES:
 * ---------
 * ✅ Real-time Dashboard - Today's reservations at a glance
 * ✅ Reservation Management - Create, edit, cancel with ease
 * ✅ Advanced Search - Filter by date, status, customer name
 * ✅ Responsive Design using Tailwind CSS - Works on desktop, tablet, mobile
 * ✅ API Authentication - Secure with API key protection
 * ✅ Error Handling - User-friendly error messages
 * ✅ Network Detection - Offline indicator and reconnection
 * ✅ Loading States - Clear feedback during operations
 * 
 * ARCHITECTURE:
 * -------------
 * - Uses centralized config for environment settings (config.js)
 * - Uses API service layer for all HTTP requests (services/api.js)
 * - Implements proper error boundaries and handling
 * - Follows React hooks patterns (useState, useEffect)
 * 
 * COMPONENTS:
 * -----------
 * - ReservationDashboard - Main container component
 * - StatCard - Statistics display cards
 * - ReservationCard - Individual reservation display
 * - ReservationForm - Create/edit reservation form
 * - Modal - Reusable modal wrapper
 * 
 * DEPENDENCIES:
 * -------------
 * - React 19 - UI library
 * - Lucide React - Icon components
 * - Tailwind CSS - Styling
 * - config.js - Environment configuration
 * - services/api.js - API communication layer
 * 
 * @module App
 * @requires react
 * @requires lucide-react
 * @requires ./config
 * @requires ./services/api
 */

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Phone,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  WifiOff,
} from "lucide-react";
import { api, ApiError, withRetry } from "./services/api";
import config from "./config";

/**
 * ============================================================================
 * MAIN DASHBOARD COMPONENT
 * ============================================================================
 * 
 * Primary application component that manages all reservation operations.
 * Handles state management, API calls, and user interactions.
 * 
 * STATE MANAGEMENT:
 * -----------------
 * - reservations: All reservations data
 * - todayReservations: Today's confirmed reservations
 * - stats: Dashboard statistics
 * - UI state: Modals, loading, filters, errors
 * - Network state: Online/offline detection
 * 
 * LIFECYCLE:
 * ----------
 * - Mounts: Fetches stats and today's reservations
 * - Tab change: Refreshes data based on active tab
 * - Online/Offline: Handles network status changes
 * 
 * ERROR HANDLING:
 * ---------------
 * - API errors: Shows user-friendly messages
 * - Network errors: Shows offline indicator
 * - Validation errors: Inline form validation
 * - Auto-dismiss: Errors auto-hide after 5 seconds
 */
export default function ReservationDashboard() {
  // ==================== STATE MANAGEMENT ====================

  /**
   * RESERVATIONS STATE
   * ------------------
   * Stores all reservations fetched from the database.
   * Updated when filters change or new reservations are created.
   * 
   * @type {Array<Reservation>}
   */
  const [reservations, setReservations] = useState([]);

  /**
   * TODAY'S RESERVATIONS STATE
   * --------------------------
   * Stores only today's confirmed reservations.
   * Used in the dashboard view for quick daily overview.
   * 
   * @type {Array<Reservation>}
   */
  const [todayReservations, setTodayReservations] = useState([]);

  /**
   * STATISTICS STATE
   * ----------------
   * Stores dashboard metrics for quick overview.
   * 
   * @type {Object}
   * @property {number} todayReservations - Count of today's bookings
   * @property {number} totalReservations - Total count (all time)
   * @property {number} cancelledToday - Today's cancellations
   */
  const [stats, setStats] = useState({
    todayReservations: 0,
    totalReservations: 0,
    cancelledToday: 0,
  });

  /**
   * UI STATE VARIABLES
   * ------------------
   * Control the display of modals, loading states, and active views.
   */
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "all"
  const [loading, setLoading] = useState(false); // Loading spinner state
  const [showCreateModal, setShowCreateModal] = useState(false); // Create modal visibility
  const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility
  const [selectedReservation, setSelectedReservation] = useState(null); // Currently selected for editing

  /**
   * FILTER STATE VARIABLES
   * ----------------------
   * Control search and filtering of reservations.
   */
  const [searchTerm, setSearchTerm] = useState(""); // Search query (name, phone, ID)
  const [filterDate, setFilterDate] = useState(""); // Date filter
  const [filterStatus, setFilterStatus] = useState(""); // Status filter

  /**
   * ERROR HANDLING STATE
   * --------------------
   * Manages error messages and network status.
   */
  const [error, setError] = useState(null); // Current error message (null = no error)
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Network status

  // ==================== NETWORK STATUS DETECTION ====================

  /**
   * NETWORK STATUS EFFECT
   * ---------------------
   * Monitors browser online/offline events and updates UI accordingly.
   * Automatically refreshes data when connection is restored.
   * 
   * EVENTS:
   * - online: Connection restored
   * - offline: Connection lost
   */
  useEffect(() => {
    /**
     * Handle online event (connection restored)
     */
    const handleOnline = () => {
      console.log('✅ Connection restored');
      setIsOnline(true);
      setError(null);
      
      // Refresh data when coming back online
      fetchStats();
      fetchTodayReservations();
    };
    
    /**
     * Handle offline event (connection lost)
     */
    const handleOffline = () => {
      console.log('❌ Connection lost');
      setIsOnline(false);
      setError('No internet connection. Please check your network.');
    };

    // Register event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ==================== LIFECYCLE HOOKS ====================

  /**
   * DATA FETCHING EFFECT
   * --------------------
   * Triggers when component mounts or when activeTab/isOnline changes.
   * 
   * ACTIONS:
   * 1. Fetch dashboard statistics
   * 2. Fetch today's reservations
   * 3. If on "all" tab, fetch all reservations
   * 
   * DEPENDENCIES:
   * - activeTab: Switches between dashboard and all reservations view
   * - isOnline: Only fetches when online
   */
  useEffect(() => {
    if (isOnline) {
      console.log('📊 Fetching initial data...');
      fetchStats();
      fetchTodayReservations();
      if (activeTab === "all") {
        fetchAllReservations();
      }
    }
  }, [activeTab, isOnline]);

  // ==================== ERROR HANDLING HELPER ====================

  /**
   * HANDLE API ERROR
   * ----------------
   * Processes API errors and displays user-friendly messages.
   * Automatically dismisses errors after 5 seconds.
   * 
   * @param {Error|ApiError} error - The error to handle
   * @param {string} defaultMessage - Fallback message if error doesn't have one
   * @returns {string} - The error message displayed to user
   * 
   * ERROR TYPES HANDLED:
   * - 401: Authentication failed
   * - 404: Resource not found
   * - 429: Rate limit exceeded
   * - 500: Server error
   * - 0: Network error (no connection)
   */
  const handleApiError = (error, defaultMessage = 'An error occurred') => {
    let errorMessage = defaultMessage;
    
    if (error instanceof ApiError) {
      errorMessage = error.message;
      
      // Special handling for common error codes
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please check your API key configuration.';
        console.error('❌ Auth error - API key may be incorrect or missing');
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network.';
    }
    
    // Set error message
    setError(errorMessage);
    console.error('Error:', errorMessage, error);
    
    // Auto-dismiss error after 5 seconds
    setTimeout(() => setError(null), 5000);
    
    return errorMessage;
  };

  // ==================== API FUNCTIONS WITH ERROR HANDLING ====================

  /**
   * FETCH STATISTICS
   * ----------------
   * Retrieves dashboard statistics from the API.
   * Uses retry logic for reliability.
   * 
   * ENDPOINT: GET /reservations/stats
   * 
   * UPDATES:
   * - stats.todayReservations
   * - stats.totalReservations
   * - stats.cancelledToday
   * 
   * ERROR HANDLING:
   * - Logs error to console
   * - Shows user-friendly error message
   * - Does not crash app on failure
   */
  const fetchStats = async () => {
    try {
      setError(null);
      console.log('📊 Fetching statistics...');
      
      // Use retry wrapper for critical data
      const data = await withRetry(() => api.get('/reservations/stats'));
      
      setStats(data);
      console.log('✅ Statistics loaded:', data);
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      handleApiError(error, 'Failed to fetch statistics');
    }
  };

  /**
   * FETCH TODAY'S RESERVATIONS
   * --------------------------
   * Retrieves all confirmed reservations for today.
   * 
   * ENDPOINT: GET /reservations/today
   * 
   * UPDATES:
   * - todayReservations array
   * 
   * SORTING:
   * - Results sorted by time (backend handles this)
   */
  const fetchTodayReservations = async () => {
    try {
      setError(null);
      console.log('📅 Fetching today\'s reservations...');
      
      const data = await withRetry(() => api.get('/reservations/today'));
      
      setTodayReservations(data);
      console.log(`✅ Loaded ${data.length} reservations for today`);
    } catch (error) {
      console.error("❌ Error fetching today's reservations:", error);
      handleApiError(error, 'Failed to fetch today\'s reservations');
    }
  };

  /**
   * FETCH ALL RESERVATIONS
   * ----------------------
   * Retrieves all reservations with optional filters.
   * Shows loading spinner during fetch.
   * 
   * ENDPOINT: GET /reservations?status=...&date=...
   * 
   * FILTERS:
   * - filterStatus: Filter by status (confirmed, cancelled, etc.)
   * - filterDate: Filter by specific date
   * 
   * UPDATES:
   * - reservations array
   * - loading state
   */
  const fetchAllReservations = async () => {
    setLoading(true);
    try {
      setError(null);
      console.log('📋 Fetching all reservations...');
      
      // Build query string with filters
      let url = '/reservations?';
      if (filterStatus) {
        url += `status=${filterStatus}&`;
        console.log(`  Filter: status=${filterStatus}`);
      }
      if (filterDate) {
        url += `date=${filterDate}`;
        console.log(`  Filter: date=${filterDate}`);
      }

      const data = await api.get(url);
      
      setReservations(data);
      console.log(`✅ Loaded ${data.length} reservations`);
    } catch (error) {
      console.error("❌ Error fetching reservations:", error);
      handleApiError(error, 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  /**
   * CREATE RESERVATION
   * ------------------
   * Creates a new reservation via the API.
   * 
   * ENDPOINT: POST /reservations
   * 
   * @param {Object} formData - Reservation data from form
   * 
   * PROCESS:
   * 1. Validate form data (handled by backend)
   * 2. Send POST request
   * 3. Close modal on success
   * 4. Refresh all data
   * 5. Show success message
   * 
   * ERROR HANDLING:
   * - Shows specific error message from backend
   * - Keeps modal open on error (user can fix and retry)
   */
  const handleCreateReservation = async (formData) => {
    try {
      setError(null);
      console.log('➕ Creating reservation:', formData);
      
      await api.post('/reservations', formData);
      
      console.log('✅ Reservation created successfully');
      setShowCreateModal(false);
      
      // Refresh all data
      fetchStats();
      fetchTodayReservations();
      if (activeTab === "all") fetchAllReservations();
      
      alert("✅ Reservation created successfully!");
    } catch (error) {
      console.error("❌ Error creating reservation:", error);
      const errorMsg = handleApiError(error, 'Failed to create reservation');
      alert(`❌ Error: ${errorMsg}`);
    }
  };

  /**
   * UPDATE RESERVATION
   * ------------------
   * Updates an existing reservation.
   * 
   * ENDPOINT: PATCH /reservations/:id
   * 
   * @param {string} id - Reservation MongoDB ObjectId
   * @param {Object} formData - Updated fields
   * 
   * PROCESS:
   * 1. Send PATCH request with updated data
   * 2. Close modal on success
   * 3. Clear selected reservation
   * 4. Refresh all data
   * 5. Show success message
   */
  const handleUpdateReservation = async (id, formData) => {
    try {
      setError(null);
      console.log(`✏️ Updating reservation ${id}:`, formData);
      
      await api.patch(`/reservations/${id}`, formData);
      
      console.log('✅ Reservation updated successfully');
      setShowEditModal(false);
      setSelectedReservation(null);
      
      // Refresh all data
      fetchStats();
      fetchTodayReservations();
      if (activeTab === "all") fetchAllReservations();
      
      alert("✅ Reservation updated successfully!");
    } catch (error) {
      console.error("❌ Error updating reservation:", error);
      const errorMsg = handleApiError(error, 'Failed to update reservation');
      alert(`❌ Error: ${errorMsg}`);
    }
  };

  /**
   * CANCEL RESERVATION
   * ------------------
   * Cancels a reservation (soft delete).
   * Confirms with user before proceeding.
   * 
   * ENDPOINT: DELETE /reservations/:id
   * 
   * @param {string} id - Reservation MongoDB ObjectId
   * 
   * PROCESS:
   * 1. Confirm with user
   * 2. Send DELETE request
   * 3. Refresh all data
   * 4. Show success message
   * 
   * NOTE:
   * - This is a soft delete (sets status to 'cancelled')
   * - Reservation remains in database for records
   */
  const handleCancelReservation = async (id) => {
    // Confirm before cancelling
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      console.log('ℹ️ Cancellation aborted by user');
      return;
    }

    try {
      setError(null);
      console.log(`🗑️ Cancelling reservation ${id}...`);
      
      await api.delete(`/reservations/${id}`);
      
      console.log('✅ Reservation cancelled successfully');
      
      // Refresh all data
      fetchStats();
      fetchTodayReservations();
      if (activeTab === "all") fetchAllReservations();
      
      alert("✅ Reservation cancelled successfully!");
    } catch (error) {
      console.error("❌ Error cancelling reservation:", error);
      const errorMsg = handleApiError(error, 'Failed to cancel reservation');
      alert(`❌ Error: ${errorMsg}`);
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * FORMAT DATE
   * -----------
   * Formats a date object to readable string.
   * 
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date (e.g., "Mon, Jan 15, 2024")
   * 
   * FORMAT:
   * - Weekday: Short (Mon, Tue, etc.)
   * - Month: Short (Jan, Feb, etc.)
   * - Day: Numeric
   * - Year: Full (2024)
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * FILTER RESERVATIONS
   * -------------------
   * Filters reservations based on search term.
   * 
   * SEARCHES IN:
   * - Customer name (case-insensitive)
   * - Phone number
   * - Reservation ID
   * 
   * @returns {Array<Reservation>} - Filtered reservations
   */
  const filteredReservations = reservations.filter(
    (res) =>
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.phone.includes(searchTerm) ||
      res.reservationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ==================== ERROR BANNER ==================== */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-white hover:text-red-100"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ==================== OFFLINE BANNER ==================== */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <WifiOff className="h-5 w-5" />
            <span className="font-medium">You are offline. Some features may not work.</span>
          </div>
        </div>
      )}

      {/* ==================== HEADER SECTION ==================== */}
      <header className="bg-white shadow-sm border-b border-slate-200" style={{ marginTop: error || !isOnline ? '48px' : '0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Restaurant Name */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Chaat Corner
                </h1>
                <p className="text-sm text-slate-600">
                  Reservation Management System
                </p>
                {/* Show API key status in development */}
                {config.isDevelopment && (
                  <p className="text-xs text-amber-600 mt-1">
                    {config.API_KEY ? '🔒 Authenticated' : '⚠️ No API Key'}
                  </p>
                )}
              </div>
            </div>

            {/* Create New Reservation Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!isOnline}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg transition-all ${
                isOnline
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="h-5 w-5" />
              New Reservation
            </button>
          </div>
        </div>
      </header>

      {/* ==================== TAB NAVIGATION ==================== */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {["dashboard", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  console.log(`📑 Switching to ${tab} tab`);
                  setActiveTab(tab);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab === "dashboard" && "Dashboard"}
                {tab === "all" && "All Reservations"}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Today's Reservations"
                value={stats.todayReservations}
                icon={<Calendar className="h-6 w-6" />}
                color="blue"
              />
              <StatCard
                title="Total Reservations"
                value={stats.totalReservations}
                icon={<CheckCircle className="h-6 w-6" />}
                color="green"
              />
              <StatCard
                title="Cancelled Today"
                value={stats.cancelledToday}
                icon={<XCircle className="h-6 w-6" />}
                color="red"
              />
            </div>

            {/* Today's Schedule Section */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <h2 className="text-xl font-semibold text-slate-900">
                  Today's Schedule
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {formatDate(new Date())}
                </p>
              </div>
              <div className="divide-y divide-slate-200">
                {todayReservations.length === 0 ? (
                  <div className="px-6 py-12 text-center text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No reservations scheduled for today</p>
                  </div>
                ) : (
                  todayReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation._id}
                      reservation={reservation}
                      onEdit={() => {
                        console.log(`✏️ Editing reservation: ${reservation.reservationId}`);
                        setSelectedReservation(reservation);
                        setShowEditModal(true);
                      }}
                      onCancel={() => handleCancelReservation(reservation._id)}
                      isOnline={isOnline}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ALL RESERVATIONS TAB ==================== */}
        {activeTab === "all" && (
          <div className="space-y-6">
            {/* Search and Filter Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name, phone, or ID..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={() => {
                  console.log('🔍 Applying filters...');
                  fetchAllReservations();
                }}
                disabled={!isOnline}
                className={`mt-4 w-full md:w-auto px-6 py-2 rounded-lg transition-colors ${
                  isOnline
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Apply Filters
              </button>
            </div>

            {/* All Reservations List */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <h2 className="text-xl font-semibold text-slate-900">
                  All Reservations ({filteredReservations.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-200">
                {loading ? (
                  <div className="px-6 py-12 text-center text-slate-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4">Loading reservations...</p>
                  </div>
                ) : filteredReservations.length === 0 ? (
                  <div className="px-6 py-12 text-center text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No reservations found</p>
                  </div>
                ) : (
                  filteredReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation._id}
                      reservation={reservation}
                      onEdit={() => {
                        console.log(`✏️ Editing reservation: ${reservation.reservationId}`);
                        setSelectedReservation(reservation);
                        setShowEditModal(true);
                      }}
                      onCancel={() => handleCancelReservation(reservation._id)}
                      isOnline={isOnline}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== MODALS ==================== */}

      {/* Create Reservation Modal */}
      {showCreateModal && (
        <Modal
          onClose={() => {
            console.log('ℹ️ Closing create modal');
            setShowCreateModal(false);
          }}
          title="Create New Reservation"
        >
          <ReservationForm
            onSubmit={handleCreateReservation}
            onCancel={() => setShowCreateModal(false)}
            isOnline={isOnline}
          />
        </Modal>
      )}

      {/* Edit Reservation Modal */}
      {showEditModal && selectedReservation && (
        <Modal
          onClose={() => {
            console.log('ℹ️ Closing edit modal');
            setShowEditModal(false);
            setSelectedReservation(null);
          }}
          title="Edit Reservation"
        >
          <ReservationForm
            reservation={selectedReservation}
            onSubmit={(data) => handleUpdateReservation(selectedReservation._id, data)}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedReservation(null);
            }}
            isOnline={isOnline}
          />
        </Modal>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * STAT CARD COMPONENT
 * ============================================================================
 * 
 * Displays a single dashboard statistic in a card format.
 * Features an icon, title, and numeric value with color theming.
 * 
 * @param {string} title - Statistic title (e.g., "Today's Reservations")
 * @param {number} value - Numeric value to display
 * @param {ReactElement} icon - Icon component from lucide-react
 * @param {string} color - Color theme: "blue", "green", or "red"
 * 
 * USAGE:
 * ------
 * <StatCard
 *   title="Today's Reservations"
 *   value={12}
 *   icon={<Calendar className="h-6 w-6" />}
 *   color="blue"
 * />
 */
function StatCard({ title, value, icon, color }) {
  // Color gradient mapping for different card types
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Left side: Title and Value */}
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          </div>

          {/* Right side: Icon with gradient background */}
          <div
            className={`bg-gradient-to-r ${colorClasses[color]} p-3 rounded-lg`}
          >
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * RESERVATION CARD COMPONENT
 * ============================================================================
 * 
 * Displays detailed information about a single reservation.
 * Includes customer info, booking details, special requests, and action buttons.
 * 
 * @param {Object} reservation - Reservation object
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onCancel - Callback when cancel button is clicked
 * @param {boolean} isOnline - Network status (enables/disables buttons)
 * 
 * FEATURES:
 * ---------
 * - Color-coded status badges
 * - Special requests display
 * - Edit/Cancel actions (only for confirmed reservations)
 * - Disabled state when offline
 * - Hover effects
 * 
 * STATUS COLORS:
 * --------------
 * - confirmed: Green
 * - cancelled: Red
 * - completed: Blue
 * - no-show: Gray
 */
function ReservationCard({ reservation, onEdit, onCancel, isOnline }) {
  // Status badge color mapping
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    "no-show": "bg-gray-100 text-gray-800",
  };

  return (
    <div className="px-6 py-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between">
        {/* Left Side: Reservation Details */}
        <div className="flex-1">
          {/* Customer Name and Status Badge */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {reservation.name}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusColors[reservation.status]
              }`}
            >
              {reservation.status}
            </span>
          </div>

          {/* Reservation Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
            {/* Phone Number */}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{reservation.phone}</span>
            </div>

            {/* Party Size */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span>{reservation.partySize} guests</span>
            </div>

            {/* Reservation Time */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{reservation.time}</span>
            </div>

            {/* Table Number */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Table {reservation.tableNumber}</span>
            </div>
          </div>

          {/* Special Requests Section (if any) */}
          {reservation.specialRequests &&
            reservation.specialRequests.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700">
                  Special Requests:
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {reservation.specialRequests.map((request, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded"
                    >
                      {request}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Reservation ID */}
          <div className="mt-2 text-xs text-slate-500">
            ID: {reservation.reservationId}
          </div>
        </div>

        {/* Right Side: Action Buttons (only for confirmed reservations) */}
        {reservation.status === "confirmed" && (
          <div className="flex items-center gap-2 ml-4">
            {/* Edit Button */}
            <button
              onClick={onEdit}
              disabled={!isOnline}
              className={`p-2 rounded-lg transition-colors ${
                isOnline
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Edit Reservation"
            >
              <Edit className="h-5 w-5" />
            </button>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              disabled={!isOnline}
              className={`p-2 rounded-lg transition-colors ${
                isOnline
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Cancel Reservation"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * RESERVATION FORM COMPONENT
 * ============================================================================
 * 
 * Form component for creating new reservations or editing existing ones.
 * 
 * @param {Object} reservation - Existing reservation data (for edit mode, optional)
 * @param {Function} onSubmit - Callback when form is submitted with valid data
 * @param {Function} onCancel - Callback when cancel button is clicked
 * @param {boolean} isOnline - Network status (enables/disables submit button)
 * 
 * FEATURES:
 * ---------
 * - Input validation for required fields
 * - Date/time selection
 * - Party size dropdown (1-12 guests)
 * - Predefined special requests + custom requests
 * - Prevents past date selection
 * - Disabled state when offline
 * 
 * VALIDATION:
 * -----------
 * - Name: Required
 * - Phone: Required
 * - Date: Required (cannot be in the past)
 * - Time: Required
 * - Party Size: Required (default: 2)
 * - Email: Optional
 * - Special Requests: Optional
 */
function ReservationForm({ reservation, onSubmit, onCancel, isOnline }) {
  /**
   * Form State
   * ----------
   * Initializes with existing reservation data (edit mode) or default values (create mode)
   */
  const [formData, setFormData] = useState({
    name: reservation?.name || "",
    phone: reservation?.phone || "",
    email: reservation?.email || "",
    partySize: reservation?.partySize || 2,
    date: reservation?.date
      ? new Date(reservation.date).toISOString().split("T")[0]
      : "",
    time: reservation?.time || "7:00 PM",
    specialRequests: reservation?.specialRequests || [],
  });

  /**
   * Custom Request Input State
   * --------------------------
   * Temporary state for adding custom special requests
   */
  const [newRequest, setNewRequest] = useState("");

  /**
   * Available Time Slots
   * --------------------
   * Restaurant operating hours in 30-minute intervals
   */
  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
  ];

  /**
   * Common Special Requests
   * -----------------------
   * Predefined options that users can select with one click
   */
  const commonRequests = [
    "Window seat",
    "High chair",
    "Birthday celebration",
    "Anniversary",
    "Vegetarian options",
    "Gluten-free options",
    "Wheelchair accessible",
    "Quiet area",
    "Outdoor seating",
  ];

  /**
   * HANDLE FORM SUBMISSION
   * ----------------------
   * Validates required fields and submits form data.
   * 
   * VALIDATION:
   * - Name: Required
   * - Phone: Required
   * - Date: Required
   * 
   * @returns {void}
   */
  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Please fill in all required fields (Name, Phone, Date)");
      console.warn('⚠️ Form validation failed - missing required fields');
      return;
    }

    console.log('📝 Submitting form data:', formData);
    onSubmit(formData);
  };

  /**
   * ADD SPECIAL REQUEST
   * -------------------
   * Adds a special request to the form if not already present.
   * 
   * @param {string} request - The special request to add
   */
  const addSpecialRequest = (request) => {
    if (!formData.specialRequests.includes(request)) {
      console.log(`➕ Adding special request: ${request}`);
      setFormData({
        ...formData,
        specialRequests: [...formData.specialRequests, request],
      });
    }
  };

  /**
   * REMOVE SPECIAL REQUEST
   * ----------------------
   * Removes a special request from the form.
   * 
   * @param {string} request - The special request to remove
   */
  const removeSpecialRequest = (request) => {
    console.log(`➖ Removing special request: ${request}`);
    setFormData({
      ...formData,
      specialRequests: formData.specialRequests.filter((r) => r !== request),
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        {/* Email Input (Optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email (Optional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="john@example.com"
          />
        </div>

        {/* Party Size Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Party Size *
          </label>
          <select
            value={formData.partySize}
            onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split("T")[0]} // Prevent booking past dates
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        {/* Time Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Time *
          </label>
          <select
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          >
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Special Requests Section */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Special Requests
        </label>

        {/* Predefined Request Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {commonRequests.map((request) => (
            <button
              key={request}
              type="button"
              onClick={() => addSpecialRequest(request)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                formData.specialRequests.includes(request)
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {request}
            </button>
          ))}
        </div>

        {/* Selected Requests Display */}
        {formData.specialRequests.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-slate-600 mb-2">Selected requests:</p>
            <div className="flex flex-wrap gap-2">
              {formData.specialRequests.map((request) => (
                <span
                  key={request}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
                >
                  {request}
                  <button
                    type="button"
                    onClick={() => removeSpecialRequest(request)}
                    className="hover:text-amber-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Custom Request Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newRequest}
            onChange={(e) => setNewRequest(e.target.value)}
            placeholder="Add custom request..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => {
              if (newRequest.trim()) {
                console.log(`➕ Adding custom request: ${newRequest}`);
                addSpecialRequest(newRequest.trim());
                setNewRequest("");
              }
            }}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-slate-200">
        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isOnline}
          className={`flex-1 px-6 py-3 rounded-lg shadow-lg transition-all ${
            isOnline
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {reservation ? "Update Reservation" : "Create Reservation"}
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * MODAL COMPONENT
 * ============================================================================
 * 
 * Reusable modal wrapper with backdrop overlay.
 * 
 * @param {ReactNode} children - Content to display inside modal
 * @param {Function} onClose - Callback function when modal should close
 * @param {string} title - Modal header title
 * 
 * FEATURES:
 * ---------
 * - Fixed positioning with centered content
 * - Semi-transparent black backdrop
 * - Scrollable content area
 * - Close button in header
 * - Maximum height of 90vh to prevent overflow
 * - Sticky header when scrolling
 */
function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header - Sticky at top when scrolling */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * END OF APP COMPONENT
 * ============================================================================
 * 
 * TESTING CHECKLIST:
 * ------------------
 * ✅ Dashboard loads with statistics
 * ✅ Today's reservations display
 * ✅ Can create new reservation
 * ✅ Can edit existing reservation
 * ✅ Can cancel reservation
 * ✅ Search and filters work
 * ✅ Network status detection works
 * ✅ Error messages display correctly
 * ✅ Offline mode disables actions
 * ✅ All API calls use authentication
 * ✅ Responsive design on mobile
 * 
 * BROWSER CONSOLE LOGS:
 * ---------------------
 * On startup, you should see:
 * - 🔧 Application Configuration
 * - 📊 Fetching initial data...
 * - 📊 Fetching statistics...
 * - 📅 Fetching today's reservations...
 * - ✅ Statistics loaded
 * - ✅ Loaded X reservations for today
 */