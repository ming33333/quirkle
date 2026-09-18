import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import SpacedRepetitionPlay, {
  SR_CYCLE_MS,
} from "../components/SpacedRepetitionPlay.jsx";
import { isAdmin } from "../utils/admins";

const WELCOME_MS = 5500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function WelcomeScene() {
  return (
    <div className="hero-story__scene hero-story__scene--welcome is-on">
      <span className="hero-story__seal" aria-hidden="true" />
      <p className="hero-story__hello">Welcome to Quirkle</p>
      <p className="hero-story__note">Dedicated to spaced repetition.</p>
      <p className="hero-story__explain">
        Cards come back when they’re due — just as they start to fade — so
        each review sticks and you study less as you remember more.
      </p>
    </div>
  );
}

function HeroStory() {
  const reduceMotion = usePrefersReducedMotion();
  const [scene, setScene] = useState("welcome");

  useEffect(() => {
    if (reduceMotion) return undefined;
    const wait = scene === "welcome" ? WELCOME_MS : SR_CYCLE_MS;
    const next = scene === "welcome" ? "sr" : "welcome";
    const timer = window.setTimeout(() => setScene(next), wait);
    return () => window.clearTimeout(timer);
  }, [scene, reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        className="hero-story hero-story--static"
        aria-label="Welcome to Quirkle. Dedicated to spaced repetition: cards come back when they are due so each review sticks."
      >
        <WelcomeScene />
        <SpacedRepetitionPlay />
      </div>
    );
  }

  return (
    <div
      className="hero-story"
      aria-label="Welcome to Quirkle. Dedicated to spaced repetition: cards come back when they are due so each review sticks."
    >
      {scene === "welcome" ? (
        <WelcomeScene />
      ) : (
        <div className="hero-story__scene hero-story__scene--sr is-on">
          <SpacedRepetitionPlay />
        </div>
      )}
    </div>
  );
}

export default function LandingPage({ user }) {
  const location = useLocation();
  const [showAdminTools, setShowAdminTools] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!user?.email) {
        if (!cancelled) setShowAdminTools(false);
        return;
      }
      try {
        const allowed = await isAdmin(user.email);
        if (!cancelled) setShowAdminTools(allowed);
      } catch {
        if (!cancelled) setShowAdminTools(false);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <main className="landing">
      <nav className="site-nav">
        <Brand />
        <div className="site-nav__actions">
          {user ? (
            <>
              {showAdminTools && (
                <Link
                  className="button button--paper button--small"
                  to="/admin"
                >
                  Admin tools
                </Link>
              )}
              <Link
                className="button button--paper button--small"
                to="/profile"
                state={{ background: location }}
              >
                Profile
              </Link>
              <Link className="button button--ink button--small" to="/dashboard">
                Open dashboard
              </Link>
            </>
          ) : (
            <span className="nav-tip">
              <Link className="button button--ink button--small" to="/login">
                Begin writing
              </Link>
              <em className="nav-tip__msg" role="tooltip">
                You’ll sign in first.
              </em>
            </span>
          )}
        </div>
      </nav>

      <section className="hero">
        <HeroStory />
        <div className="hero__actions">
          {user ? (
            <Link className="button button--vermilion" to="/dashboard">
              Continue
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className="nav-tip">
              <Link className="button button--vermilion" to="/login">
                Begin writing
                <span aria-hidden="true">→</span>
              </Link>
              <em className="nav-tip__msg" role="tooltip">
                You’ll sign in first.
              </em>
            </span>
          )}
        </div>
        <Link className="text-link" to="/spaced-repetition">
          What is spaced repetition?
        </Link>
      </section>

      <footer className="landing-about">
        <p className="eyebrow">About</p>
        <p>
          Quirkle is made by{" "}
          <Link className="text-link" to="/lucky-software">
            Lucky Software
          </Link>
          .
        </p>
        <p>
          Feature requests or support:{" "}
          <a className="text-link" href="mailto:luckysoftwaretexas@gmail.com">
            luckysoftwaretexas@gmail.com
          </a>
        </p>
      </footer>
    </main>
  );
}
