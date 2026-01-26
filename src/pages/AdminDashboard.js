import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllDocumentsFromCollection } from "../utils/firebase/firebaseServices";

/**
 * Admin-only dashboard page. Access is restricted to users
 * who have a document in the Firestore "admins" collection (see AdminRoute).
 */
const AdminDashboard = ({ user }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const list = await getAllDocumentsFromCollection("admins");
        setAdmins(list || []);
      } catch (err) {
        console.error("Error loading admins:", err);
        setError(err.message || "Failed to load admins");
      } finally {
        setLoading(false);
      }
    };
    loadAdmins();
  }, []);

  return (
    <div
      style={{
        padding: "32px 24px",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>Admin Dashboard</h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Signed in as <strong>{user?.email ?? ""}</strong>. Only users in the
        admins collection can see this page.
      </p>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Admins</h2>
        {loading && <p style={{ color: "#888" }}>Loading admins…</p>}
        {error && <p style={{ color: "#c62828" }}>{error}</p>}
        {!loading && !error && admins.length === 0 && (
          <p style={{ color: "#888" }}>No admins in the collection.</p>
        )}
        {!loading && !error && admins.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {admins.map((admin) => (
              <li
                key={admin.id}
                style={{
                  padding: "10px 14px",
                  borderBottom:
                    admins.indexOf(admin) < admins.length - 1
                      ? "1px solid #eee"
                      : "none",
                  background:
                    admin.id === user?.email ? "rgba(76, 175, 80, 0.1)" : "#fff",
                }}
              >
                {admin.id}
                {admin.id === user?.email && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "0.85em",
                      color: "#2e7d32",
                      fontWeight: 600,
                    }}
                  >
                    (you)
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <nav style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Link
          to="/admin"
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Database Admin
        </Link>
        <Link
          to="/home"
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            background: "#f0f0f0",
            color: "#333",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Back to Home
        </Link>
      </nav>
    </div>
  );
};

export default AdminDashboard;
