import { useEffect, useState } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ImpersonationBanner from "./components/ImpersonationBanner.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LuckySoftwarePage from "./pages/LuckySoftwarePage.jsx";
import SpacedRepetitionPage from "./pages/SpacedRepetitionPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StudyPage from "./pages/StudyPage.jsx";
import PreviewPage from "./pages/PreviewPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage.jsx";
import SubscriptionCancelPage from "./pages/SubscriptionCancelPage.jsx";
import {
  ImpersonationProvider,
  useImpersonation,
} from "./context/ImpersonationContext.jsx";
import { auth, logPageView } from "./utils/firebase";
import { prefetchSubscriptionDetails } from "./utils/subscription";

const PROFILE_BACKGROUND = {
  pathname: "/dashboard",
  search: "",
  hash: "",
  state: null,
  key: "profile-bg",
};

function AppRoutes({ user }) {
  const { effectiveUser } = useImpersonation();
  const location = useLocation();
  const navigate = useNavigate();
  const viewUser = effectiveUser || user;
  const profileOpen = location.pathname === "/profile";
  const profileBackground = location.state?.background;

  useEffect(() => {
    logPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  useEffect(() => {
    prefetchSubscriptionDetails(viewUser?.email);
  }, [viewUser?.email]);
  const routesLocation = profileOpen
    ? profileBackground || PROFILE_BACKGROUND
    : location;

  const closeProfile = () => {
    if (profileBackground?.pathname) {
      navigate(
        `${profileBackground.pathname}${profileBackground.search || ""}`,
      );
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  return (
    <>
      <ImpersonationBanner />
      <Routes location={routesLocation}>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/lucky-software" element={<LuckySoftwarePage />} />
        <Route
          path="/spaced-repetition"
          element={<SpacedRepetitionPage />}
        />
        <Route path="/login" element={<LoginPage user={user} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={viewUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview/:deckId"
          element={
            <ProtectedRoute user={user}>
              <PreviewPage user={viewUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:deckId"
          element={
            <ProtectedRoute user={user}>
              <PreviewPage user={viewUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:deckId/run"
          element={
            <ProtectedRoute user={user}>
              <StudyPage user={viewUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription-success"
          element={
            <ProtectedRoute user={user}>
              <SubscriptionSuccessPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription-cancel"
          element={
            <ProtectedRoute user={user}>
              <SubscriptionCancelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <AdminPage user={user} />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {profileOpen && (
        <ProtectedRoute user={user}>
          <ProfilePage onClose={closeProfile} user={viewUser} />
        </ProtectedRoute>
      )}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);
      }),
    [],
  );

  if (checkingAuth) {
    return (
      <div className="app-loading">
        <span className="brand__seal" aria-hidden="true">
          <img alt="" src="/red_panda.jpg" />
        </span>
        <p>Opening your notebook…</p>
      </div>
    );
  }

  return (
    <ImpersonationProvider user={user}>
      <HashRouter>
        <AppRoutes user={user} />
      </HashRouter>
    </ImpersonationProvider>
  );
}
