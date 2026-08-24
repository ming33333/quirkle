import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdmin } from "../utils/admins";

export default function AdminRoute({ user, children }) {
  const location = useLocation();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!user?.email) {
        if (!cancelled) setAllowed(false);
        return;
      }
      try {
        const ok = await isAdmin(user.email);
        if (!cancelled) setAllowed(ok);
      } catch (error) {
        console.error("Error verifying admin access:", error);
        if (!cancelled) setAllowed(false);
      }
    };

    setAllowed(null);
    check();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowed === null) {
    return (
      <div className="app-loading">
        <span className="brand__seal" aria-hidden="true">
          <img alt="" src="/red_panda.jpg" />
        </span>
        <p>Checking admin access…</p>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
