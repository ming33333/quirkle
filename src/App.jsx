import { useEffect, useState } from "react";
import {
  BrowserRouter,
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
import HowToPage from "./pages/HowToPage.jsx";
import LuckySoftwarePage from "./pages/LuckySoftwarePage.jsx";
import SpacedRepetitionPage from "./pages/SpacedRepetitionPage.jsx";
import StudyTopicPage from "./pages/StudyTopicPage.jsx";
import StudyTopicsIndexPage from "./pages/StudyTopicsIndexPage.jsx";
import LearnLanguagePage from "./pages/LearnLanguagePage.jsx";
import LearnLanguagesIndexPage from "./pages/LearnLanguagesIndexPage.jsx";
import LearnAiPage from "./pages/LearnAiPage.jsx";
import GemstonePage from "./pages/GemstonePage.jsx";
import GemstonesIndexPage from "./pages/GemstonesIndexPage.jsx";
import StarSignsPage from "./pages/StarSignsPage.jsx";
import StatisticPage from "./pages/StatisticPage.jsx";
import StatisticsIndexPage from "./pages/StatisticsIndexPage.jsx";
import EconomicPage from "./pages/EconomicPage.jsx";
import EconomicsIndexPage from "./pages/EconomicsIndexPage.jsx";
import PhysicsPage from "./pages/PhysicsPage.jsx";
import PhysicsIndexPage from "./pages/PhysicsIndexPage.jsx";
import ComputingPage from "./pages/ComputingPage.jsx";
import ComputingIndexPage from "./pages/ComputingIndexPage.jsx";
import GrammarPage from "./pages/GrammarPage.jsx";
import GrammarIndexPage from "./pages/GrammarIndexPage.jsx";
import BusinessPage from "./pages/BusinessPage.jsx";
import BusinessIndexPage from "./pages/BusinessIndexPage.jsx";
import ClusterIndexPage from "./pages/ClusterIndexPage.jsx";
import ClusterTopicPage from "./pages/ClusterTopicPage.jsx";
import { ARTS } from "./data/arts.js";
import { AVIATION } from "./data/aviation.js";
import { BUILDING } from "./data/building.js";
import { CHEMISTRY } from "./data/chemistry.js";
import { GEOGRAPHY } from "./data/geography.js";
import { HEALTH } from "./data/health.js";
import { HISTORY } from "./data/history.js";
import { HOME } from "./data/home.js";
import { NATURE } from "./data/nature.js";
import { PSYCHOLOGY } from "./data/psychology.js";
import { RELIGION } from "./data/religion.js";
import { SPACE } from "./data/space.js";
import { WORK } from "./data/work.js";
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
        <Route path="/how-to" element={<HowToPage user={user} />} />
        <Route path="/lucky-software" element={<LuckySoftwarePage />} />
        <Route
          path="/spaced-repetition"
          element={<SpacedRepetitionPage user={user} />}
        />
        <Route path="/how-to-study" element={<StudyTopicsIndexPage />} />
        <Route
          path="/how-to-study/:slug"
          element={<StudyTopicPage user={user} />}
        />
        <Route path="/how-to-learn" element={<LearnLanguagesIndexPage />} />
        <Route path="/how-to-learn/ai" element={<LearnAiPage user={user} />} />
        <Route
          path="/how-to-learn/:slug"
          element={<LearnLanguagePage user={user} />}
        />
        <Route path="/gemstones" element={<GemstonesIndexPage />} />
        <Route
          path="/gemstones/:slug"
          element={<GemstonePage user={user} />}
        />
        <Route
          path="/star-signs-dates"
          element={<StarSignsPage user={user} />}
        />
        <Route path="/statistics" element={<StatisticsIndexPage />} />
        <Route
          path="/statistics/:slug"
          element={<StatisticPage user={user} />}
        />
        <Route path="/economics" element={<EconomicsIndexPage />} />
        <Route
          path="/economics/:slug"
          element={<EconomicPage user={user} />}
        />
        <Route path="/physics" element={<PhysicsIndexPage />} />
        <Route path="/physics/:slug" element={<PhysicsPage user={user} />} />
        <Route path="/computing" element={<ComputingIndexPage />} />
        <Route
          path="/computing/:slug"
          element={<ComputingPage user={user} />}
        />
        <Route path="/grammar" element={<GrammarIndexPage />} />
        <Route path="/grammar/:slug" element={<GrammarPage user={user} />} />
        <Route path="/business" element={<BusinessIndexPage />} />
        <Route path="/business/:slug" element={<BusinessPage user={user} />} />
        <Route
          path="/geography"
          element={
            <ClusterIndexPage
              metaTitle="Geography questions — Quirkle"
              description="How many countries there are, and which countries are in North America, Europe, Asia, and NATO. Short answers, a sample deck, and a spaced review schedule."
              eyebrow="Geography"
              title="Geography questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next geography question goes."
              items={GEOGRAPHY}
              basePath="/geography"
              links={[{ href: "/history", label: "History questions" }]}
            />
          }
        />
        <Route
          path="/geography/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={GEOGRAPHY}
              basePath="/geography"
              indexLabel="All geography questions"
            />
          }
        />
        <Route
          path="/history"
          element={
            <ClusterIndexPage
              metaTitle="History questions — Quirkle"
              description="What are the 7 wonders of the world. A short answer, a sample deck, and a spaced review schedule."
              eyebrow="History"
              title="History questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next history question goes."
              items={HISTORY}
              basePath="/history"
              links={[{ href: "/geography", label: "Geography questions" }]}
            />
          }
        />
        <Route
          path="/history/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={HISTORY}
              basePath="/history"
              indexLabel="All history questions"
            />
          }
        />
        <Route
          path="/religion"
          element={
            <ClusterIndexPage
              metaTitle="Religion questions — Quirkle"
              description="What are the 10 commandments. A short answer, a sample deck, and a spaced review schedule."
              eyebrow="Religion"
              title="Religion questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next religion question goes."
              items={RELIGION}
              basePath="/religion"
              links={[{ href: "/history", label: "History questions" }]}
            />
          }
        />
        <Route
          path="/religion/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={RELIGION}
              basePath="/religion"
              indexLabel="All religion questions"
            />
          }
        />
        <Route
          path="/health"
          element={
            <ClusterIndexPage
              metaTitle="Health questions — Quirkle"
              description="Blood types, the five patterns of psoriatic arthritis, and the four OCD themes. Short answers, a sample deck, and a spaced review schedule."
              eyebrow="Health"
              title="Health questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next health question goes."
              items={HEALTH}
              basePath="/health"
              links={[{ href: "/psychology", label: "Psychology questions" }]}
            />
          }
        />
        <Route
          path="/health/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={HEALTH}
              basePath="/health"
              indexLabel="All health questions"
            />
          }
        />
        <Route
          path="/psychology"
          element={
            <ClusterIndexPage
              metaTitle="Psychology questions — Quirkle"
              description="What are the types of personality. A short answer, a sample deck, and a spaced review schedule."
              eyebrow="Psychology"
              title="Psychology questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next psychology question goes."
              items={PSYCHOLOGY}
              basePath="/psychology"
              links={[{ href: "/health", label: "Health questions" }]}
            />
          }
        />
        <Route
          path="/psychology/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={PSYCHOLOGY}
              basePath="/psychology"
              indexLabel="All psychology questions"
            />
          }
        />
        <Route
          path="/nature"
          element={
            <ClusterIndexPage
              metaTitle="Nature questions — Quirkle"
              description="Types of roses, trees, saltwater fish, and water. Short answers, a sample deck, and a spaced review schedule."
              eyebrow="Nature"
              title="Nature questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next nature question goes."
              items={NATURE}
              basePath="/nature"
              links={[{ href: "/space", label: "Space questions" }]}
            />
          }
        />
        <Route
          path="/nature/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={NATURE}
              basePath="/nature"
              indexLabel="All nature questions"
            />
          }
        />
        <Route
          path="/space"
          element={
            <ClusterIndexPage
              metaTitle="Space questions — Quirkle"
              description="Types of stars and types of galaxies. Short answers, a sample deck, and a spaced review schedule."
              eyebrow="Space"
              title="Space questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next space question goes."
              items={SPACE}
              basePath="/space"
              links={[{ href: "/nature", label: "Nature questions" }]}
            />
          }
        />
        <Route
          path="/space/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={SPACE}
              basePath="/space"
              indexLabel="All space questions"
            />
          }
        />
        <Route
          path="/chemistry"
          element={
            <ClusterIndexPage
              metaTitle="Chemistry questions — Quirkle"
              description="What are the types of chemical bonds. A short answer, a sample deck, and a spaced review schedule."
              eyebrow="Chemistry"
              title="Chemistry questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next chemistry question goes."
              items={CHEMISTRY}
              basePath="/chemistry"
              links={[{ href: "/physics", label: "Physics questions" }]}
            />
          }
        />
        <Route
          path="/chemistry/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={CHEMISTRY}
              basePath="/chemistry"
              indexLabel="All chemistry questions"
            />
          }
        />
        <Route
          path="/building"
          element={
            <ClusterIndexPage
              metaTitle="Building questions — Quirkle"
              description="Construction materials, sites, equipment, and furniture. Short answers, a sample deck, and a spaced review schedule."
              eyebrow="Building"
              title="Building questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next building question goes."
              items={BUILDING}
              basePath="/building"
              links={[{ href: "/home", label: "Home questions" }]}
            />
          }
        />
        <Route
          path="/building/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={BUILDING}
              basePath="/building"
              indexLabel="All building questions"
            />
          }
        />
        <Route
          path="/home"
          element={
            <ClusterIndexPage
              metaTitle="Home questions — Quirkle"
              description="Types of knives, water filters, and coffee. Short answers, a sample deck, and a spaced review schedule."
              eyebrow="Home"
              title="Home questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next home question goes."
              items={HOME}
              basePath="/home"
              links={[{ href: "/building", label: "Building questions" }]}
            />
          }
        />
        <Route
          path="/home/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={HOME}
              basePath="/home"
              indexLabel="All home questions"
            />
          }
        />
        <Route
          path="/aviation"
          element={
            <ClusterIndexPage
              metaTitle="Aviation questions — Quirkle"
              description="Types of aircraft and types of airplanes. Short answers, a sample deck, and a spaced review schedule."
              eyebrow="Aviation"
              title="Aviation questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next aviation question goes."
              items={AVIATION}
              basePath="/aviation"
              links={[{ href: "/physics", label: "Physics questions" }]}
            />
          }
        />
        <Route
          path="/aviation/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={AVIATION}
              basePath="/aviation"
              indexLabel="All aviation questions"
            />
          }
        />
        <Route
          path="/arts"
          element={
            <ClusterIndexPage
              metaTitle="Arts questions — Quirkle"
              description="Types of modeling and types of camera shots. Short answers, a sample deck, and a spaced review schedule."
              eyebrow="Arts"
              title="Arts questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next arts question goes."
              items={ARTS}
              basePath="/arts"
              links={[{ href: "/work", label: "Work questions" }]}
            />
          }
        />
        <Route
          path="/arts/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={ARTS}
              basePath="/arts"
              indexLabel="All arts questions"
            />
          }
        />
        <Route
          path="/work"
          element={
            <ClusterIndexPage
              metaTitle="Work questions — Quirkle"
              description="What are the different types of guards. A short answer, a sample deck, and a spaced review schedule."
              eyebrow="Work"
              title="Work questions"
              lede="One question per page. Each answer is short enough to put on a card, and the list is where the next work question goes."
              items={WORK}
              basePath="/work"
              links={[{ href: "/arts", label: "Arts questions" }]}
            />
          }
        />
        <Route
          path="/work/:slug"
          element={
            <ClusterTopicPage
              user={user}
              items={WORK}
              basePath="/work"
              indexLabel="All work questions"
            />
          }
        />
        <Route path="/login" element={<LoginPage user={user} />} />
        <Route path="/try" element={<PreviewPage guest user={user} />} />
        <Route path="/try/run" element={<StudyPage guest user={user} />} />
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
      <BrowserRouter>
        <AppRoutes user={user} />
      </BrowserRouter>
    </ImpersonationProvider>
  );
}
