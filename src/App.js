/**
 * Main Application Component - Restaurant Reservation Dashboard
 *
 * This is the primary component for Chaat Corner's reservation management system.
 *
 * Features:
 * - Dashboard view showing today's reservations and statistics
 * - All reservations view with search and filtering capabilities
 * - Create new reservations with form validation
 * - Edit existing reservations
 * - Cancel reservations with confirmation
 * - Real-time data synchronization with backend API
 * - Responsive design using Tailwind CSS
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
} from "lucide-react";

export default function ReservationDashboard() {
  // ==================== STATE MANAGEMENT ====================

  /**
   * Reservations State
   * Stores all reservations fetched from the database
   */
  const [reservations, setReservations] = useState([]);

  /**
   * Today's Reservations State
   * Stores only today's confirmed reservations
   */
  const [todayReservations, setTodayReservations] = useState([]);

  /**
   * Statistics State
   * Stores dashboard metrics (today's count, total count, cancelled count)
   */
  const [stats, setStats] = useState({
    todayReservations: 0,
    totalReservations: 0,
    cancelledToday: 0,
  });

  /**
   * UI State Variables
   */
  const [activeTab, setActiveTab] = useState("dashboard"); // Current tab: "dashboard" or "all"
  const [loading, setLoading] = useState(false); // Loading spinner state
  const [showCreateModal, setShowCreateModal] = useState(false); // Create modal visibility
  const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility
  const [selectedReservation, setSelectedReservation] = useState(null); // Currently selected reservation for editing

  /**
   * Filter State Variables
   */
  const [searchTerm, setSearchTerm] = useState(""); // Search query (name, phone, or ID)
  const [filterDate, setFilterDate] = useState(""); // Date filter
  const [filterStatus, setFilterStatus] = useState(""); // Status filter (confirmed, cancelled, etc.)

  /**
   * Backend API Base URL
   * Points to the NestJS backend running on port 3001
   */
  const API_URL = "http://localhost:3001";

  // ==================== LIFECYCLE HOOKS ====================

  /**
   * useEffect Hook - Data Fetching
   *
   * Triggers when:
   * - Component mounts (initial load)
   * - activeTab changes (switching between Dashboard and All Reservations)
   *
   * Actions:
   * 1. Fetch dashboard statistics
   * 2. Fetch today's reservations
   * 3. If on "all" tab, fetch all reservations
   */
  useEffect(() => {
    fetchStats();
    fetchTodayReservations();
    if (activeTab === "all") {
      fetchAllReservations();
    }
  }, [activeTab]);

  // ==================== API FUNCTIONS ====================

  /**
   * Fetches Dashboard Statistics
   *
   * Endpoint: GET /reservations/stats
   *
   * Updates the stats state with:
   * - todayReservations: Count of confirmed reservations for today
   * - totalReservations: Total count of all reservations
   * - cancelledToday: Count of cancelled reservations for today
   */
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  /**
   * Fetches Today's Reservations
   *
   * Endpoint: GET /reservations/today
   *
   * Retrieves all confirmed reservations for today, sorted by time
   * Used in the Dashboard view
   */
  const fetchTodayReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations/today`);
      const data = await response.json();
      setTodayReservations(data);
    } catch (error) {
      console.error("Error fetching today reservations:", error);
    }
  };

  /**
   * Fetches All Reservations with Filters
   *
   * Endpoint: GET /reservations?status=...&date=...
   *
   * Applies optional filters:
   * - status: Filter by reservation status
   * - date: Filter by specific date
   *
   * Sets loading state during fetch operation
   */
  const fetchAllReservations = async () => {
    setLoading(true);
    try {
      // Build query string with filters
      let url = `${API_URL}/reservations?`;
      if (filterStatus) url += `status=${filterStatus}&`;
      if (filterDate) url += `date=${filterDate}`;

      const response = await fetch(url);
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a New Reservation
   *
   * Endpoint: POST /reservations
   *
   * @param {Object} formData - Reservation details from the form
   *   - name: Customer's full name
   *   - phone: Customer's phone number
   *   - email: Customer's email (optional)
   *   - partySize: Number of guests
   *   - date: Reservation date (YYYY-MM-DD)
   *   - time: Reservation time (e.g., "7:00 PM")
   *   - specialRequests: Array of special requests
   *
   * On Success:
   * - Closes the create modal
   * - Refreshes stats and reservation lists
   * - Shows success alert
   *
   * On Error:
   * - Shows error message from backend
   */
  const handleCreateReservation = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateModal(false);
        fetchStats();
        fetchTodayReservations();
        if (activeTab === "all") fetchAllReservations();
        alert("Reservation created successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert("Failed to create reservation");
    }
  };

  /**
   * Updates an Existing Reservation
   *
   * Endpoint: PATCH /reservations/:id
   *
   * @param {string} id - MongoDB ObjectId of the reservation
   * @param {Object} formData - Updated reservation fields
   *
   * On Success:
   * - Closes edit modal
   * - Clears selected reservation
   * - Refreshes all data
   * - Shows success alert
   *
   * On Error:
   * - Shows error message (e.g., no tables available for new time)
   */
  const handleUpdateReservation = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedReservation(null);
        fetchStats();
        fetchTodayReservations();
        if (activeTab === "all") fetchAllReservations();
        alert("Reservation updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Failed to update reservation");
    }
  };

  /**
   * Cancels a Reservation
   *
   * Endpoint: DELETE /reservations/:id
   *
   * @param {string} id - MongoDB ObjectId of the reservation
   *
   * Shows confirmation dialog before proceeding
   * Sets reservation status to "cancelled" (soft delete)
   *
   * On Success:
   * - Refreshes all data
   * - Shows success alert
   */
  const handleCancelReservation = async (id) => {
    // Confirm before cancelling
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;

    try {
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchStats();
        fetchTodayReservations();
        if (activeTab === "all") fetchAllReservations();
        alert("Reservation cancelled successfully!");
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert("Failed to cancel reservation");
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Formats a Date to Readable String
   *
   * @param {Date|string} date - Date object or ISO string
   * @returns {string} Formatted date (e.g., "Mon, Jan 15, 2024")
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
   * Filters Reservations Based on Search Term
   *
   * Searches in:
   * - Customer name (case-insensitive)
   * - Phone number
   * - Reservation ID
   *
   * @returns {Array} Filtered reservation array
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
      {/* ==================== HEADER SECTION ==================== */}
      <header className="bg-white shadow-sm border-b border-slate-200">
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
              </div>
            </div>

            {/* Create New Reservation Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
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
                onClick={() => setActiveTab(tab)}
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
                  // Empty state when no reservations
                  <div className="px-6 py-12 text-center text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No reservations scheduled for today</p>
                  </div>
                ) : (
                  // List of today's reservations
                  todayReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation._id}
                      reservation={reservation}
                      onEdit={() => {
                        setSelectedReservation(reservation);
                        setShowEditModal(true);
                      }}
                      onCancel={() => handleCancelReservation(reservation._id)}
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
                onClick={fetchAllReservations}
                className="mt-4 w-full md:w-auto px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
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
                  // Loading state
                  <div className="px-6 py-12 text-center text-slate-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4">Loading reservations...</p>
                  </div>
                ) : filteredReservations.length === 0 ? (
                  // Empty state
                  <div className="px-6 py-12 text-center text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No reservations found</p>
                  </div>
                ) : (
                  // List of filtered reservations
                  filteredReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation._id}
                      reservation={reservation}
                      onEdit={() => {
                        setSelectedReservation(reservation);
                        setShowEditModal(true);
                      }}
                      onCancel={() => handleCancelReservation(reservation._id)}
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
          onClose={() => setShowCreateModal(false)}
          title="Create New Reservation"
        >
          <ReservationForm
            onSubmit={(data) => {
              handleCreateReservation(data);
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      {/* Edit Reservation Modal */}
      {showEditModal && selectedReservation && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit Reservation">
          <ReservationForm
            reservation={selectedReservation}
            onSubmit={(data) => {
              handleUpdateReservation(selectedReservation._id, data);
            }}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

// ==================== COMPONENT: StatCard ====================
/**
 * StatCard Component
 *
 * Displays a single dashboard statistic in a card format
 * Features an icon, title, and numeric value
 *
 * @param {string} title - Statistic title (e.g., "Today's Reservations")
 * @param {number} value - Numeric value to display
 * @param {ReactElement} icon - Icon component from lucide-react
 * @param {string} color - Color theme: "blue", "green", or "red"
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

// ==================== COMPONENT: ReservationCard ====================
/**
 * ReservationCard Component
 *
 * Displays detailed information about a single reservation
 * Includes customer info, booking details, special requests, and action buttons
 *
 * @param {Object} reservation - Reservation object containing:
 *   - _id: MongoDB ObjectId
 *   - name: Customer name
 *   - phone: Phone number
 *   - partySize: Number of guests
 *   - time: Reservation time
 *   - tableNumber: Assigned table
 *   - status: Reservation status
 *   - specialRequests: Array of special requests
 *   - reservationId: Unique identifier
 * @param {Function} onEdit - Callback function when edit button is clicked
 * @param {Function} onCancel - Callback function when cancel button is clicked
 */
function ReservationCard({ reservation, onEdit, onCancel }) {
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
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Reservation"
            >
              <Edit className="h-5 w-5" />
            </button>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

// ==================== COMPONENT: ReservationForm ====================
/**
 * ReservationForm Component
 *
 * Form component for creating new reservations or editing existing ones
 * Features:
 * - Input validation for required fields
 * - Date/time selection
 * - Party size dropdown
 * - Special requests (predefined + custom)
 * - Form submission handling
 *
 * @param {Object} reservation - Existing reservation data (for edit mode, optional)
 * @param {Function} onSubmit - Callback when form is submitted with valid data
 * @param {Function} onCancel - Callback when cancel button is clicked
 */
function ReservationForm({ reservation, onSubmit, onCancel }) {
  /**
   * Form State
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
   * Temporary state for adding custom special requests
   */
  const [newRequest, setNewRequest] = useState("");

  /**
   * Available Time Slots
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
   * Handles Form Submission
   *
   * Validates required fields (name, phone, date)
   * Calls onSubmit callback with form data if valid
   * Shows alert if validation fails
   */
  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  /**
   * Adds a Special Request to the Form
   *
   * @param {string} request - The special request to add
   *
   * Only adds if the request is not already in the list
   */
  const addSpecialRequest = (request) => {
    if (!formData.specialRequests.includes(request)) {
      setFormData({
        ...formData,
        specialRequests: [...formData.specialRequests, request],
      });
    }
  };

  /**
   * Removes a Special Request from the Form
   *
   * @param {string} request - The special request to remove
   */
  const removeSpecialRequest = (request) => {
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
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="+1 (555) 123-4567"
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, partySize: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
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

// ==================== COMPONENT: Modal ====================
/**
 * Modal Component
 *
 * Reusable modal wrapper with backdrop overlay
 * Features:
 * - Fixed positioning with centered content
 * - Semi-transparent black backdrop
 * - Scrollable content area
 * - Close button in header
 * - Maximum height of 90vh to prevent overflow
 *
 * @param {ReactNode} children - Content to display inside modal
 * @param {Function} onClose - Callback function when modal should close
 * @param {string} title - Modal header title
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
