/**
 * AdminRoute.js - Admin Authorization/Route Guard Component
 *
 * This is a React component that acts as a "route guard" or "protected route wrapper".
 * It handles the authorization logic for admin pages by:
 * 1. Checking if a user is logged in
 * 2. Verifying if the user has admin privileges (checks 'admins' collection in Firestore)
 * 3. Rendering the Admin page if authorized, or redirecting if not
 *
 * Key Points:
 * - This is NOT a route definition - it's a component that wraps/admin protects content
 * - Handles async admin check (loading states, error handling)
 * - Redirects unauthenticated users to /login
 * - Redirects authenticated non-admin users to /home
 * - Only renders the Admin page component if user is authenticated AND is an admin
 *
 * Difference from AdminRoutes.js:
 * - AdminRoute.js = Authorization component (this file) - checks permissions, manages state
 * - AdminRoutes.js = Route definition file - defines which URL uses this component
 *
 * @param {Object} user - The current authenticated user object from Firebase Auth
 * @returns {JSX.Element} Either the Admin page, a loading indicator, or a redirect
 */
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/firebase/firebaseServices";
import Admin from "../pages/admin";

const AdminRoute = ({ user }) => {
  const [adminStatus, setAdminStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setAdminStatus(false);
        setLoading(false);
        return;
      }

      try {
        const isUserAdmin = await isAdmin(user.email);
        setAdminStatus(isUserAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdminStatus(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!adminStatus) {
    return <Navigate to="/home" />;
  }

  return <Admin user={user} />;
};

export default AdminRoute;
