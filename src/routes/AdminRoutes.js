/**
 * AdminRoutes.js - Route Definitions for Admin Pages
 *
 * This file defines the route configuration for admin-only routes.
 * It's a route definition file that tells React Router which URL paths
 * should be handled by admin components.
 *
 * Key Points:
 * - Defines the URL path (e.g., "/admin") and which component to render
 * - Similar to AppRoutes.js, but specifically for admin routes
 * - Uses AdminRoute component (from ./AdminRoute.js) to handle authorization
 *
 * Difference from AdminRoute.js:
 * - AdminRoutes.js = Route definition (maps URL path to component)
 * - AdminRoute.js = Authorization component (checks permissions, redirects if needed)
 *
 * @param {Object} user - The current authenticated user object
 * @returns {Array} Array of Route elements for admin routes
 */
import React from "react";
import { Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import Admin from "../pages/admin";
import AdminDashboard from "../pages/AdminDashboard";

export const createAdminRoutes = ({ user }) => {
  return [
    <Route
      key="/admin"
      path="/admin"
      element={<AdminRoute user={user} component={Admin} />}
    />,
    <Route
      key="/admin-dashboard"
      path="/admin-dashboard"
      element={<AdminRoute user={user} component={AdminDashboard} />}
    />,
  ];
};
