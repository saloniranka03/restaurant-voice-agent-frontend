/**
 * Application Entry Point
 *
 * This file is the entry point for the React application.
 * It renders the main App component into the DOM.
 *
 * Features:
 * - Creates React root element
 * - Wraps app in StrictMode for development warnings
 * - Imports global CSS styles
 * - Optionally reports web vitals for performance monitoring
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global styles including Tailwind
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Create root element and mount React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Performance Monitoring (Optional)
 *
 * Uncomment to log performance metrics to console
 * or send to analytics endpoint
 *
 * Learn more: https://bit.ly/CRA-vitals
 */
reportWebVitals();
