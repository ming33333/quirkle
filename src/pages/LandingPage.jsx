import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import DeskIllustration from "../components/DeskIllustration.jsx";
import { isAdmin } from "../utils/admins";
import { usePageMeta } from "../utils/pageMeta.js";
import { SUPPORT_EMAIL } from "../utils/subscription";

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

function SignInCta({ className, children }) {
  return (
    <span className="nav-tip">
      <Link className={className} to="/login">
        {children}
      </Link>
      <em className="nav-tip__msg" role="tooltip">
        You’ll sign in with Google first.
      </em>
    </span>
  );
}

function PrimaryCta({ user, children }) {
  if (user) {
    return (
      <Link className="button button--vermilion" to="/dashboard">
        {children}
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <Link className="button button--vermilion" to="/try">
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export default function LandingPage({ user }) {
  const location = useLocation();
  const [showAdminTools, setShowAdminTools] = useState(false);

  usePageMeta(
    "Quirkle — your cozy study nook",
    "Study less. Remember more. Quirkle uses spaced repetition — the Leitner system — so cards only come back when you’re about to forget them.",
  );

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
    <main className="landing" data-landing-variant="interactive">
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
              <Link
                className="button button--ink button--small"
                to="/dashboard"
              >
                Open dashboard
              </Link>
            </>
          ) : (
            <SignInCta className="button button--ink button--small">
              Sign in
            </SignInCta>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>
          <span>Study less.</span>
          <span>Remember more.</span>
        </h1>
        <DeskIllustration />
        <p className="hero__lede">
          Quirkle is your cozy study nook to make studying easier…{" "}
          <button
            className="hero__how text-link"
            onClick={() => scrollToId("why")}
            type="button"
          >
            Yeah, but how?
          </button>
        </p>
      </section>

      <section className="landing-copy landing-copy--narrow" id="why">
        <p className="eyebrow">Why this place</p>
        <h2>Cramming feels like studying. It isn’t.</h2>
        <p>
          Quirkle is here so you learn what you need to learn, with tools that
          make that learning faster. A neat, distraction-free space. It will
          stay <strong>ad-free</strong> and minimal, so you can get some deep
          work done.
        </p>
        <blockquote className="landing-quote">
          <p>
            I tried to study on other sites. They were full of distracting ads,
            and they kept pushing tools I didn’t need. I wanted a better place
            to learn, so I built this one.
          </p>
          <cite>~ A fellow student</cite>
        </blockquote>
      </section>

      <section className="landing-close">
        <p className="eyebrow">Do I need this now?</p>
        <h2>Save the most important resource you have: time.</h2>
        <p>You don’t need to study for hours. Let the tools help.</p>
        <PrimaryCta user={user}>
          {user ? "Continue studying" : "Start a free deck"}
        </PrimaryCta>
      </section>

      <footer className="landing-about">
        <p className="eyebrow">About</p>
        <p>
          <Link className="text-link" to="/how-to">
            How to use
          </Link>
        </p>
        <p>
          Quirkle is made by{" "}
          <Link className="text-link" to="/lucky-software">
            Lucky Software
          </Link>
          .
        </p>
        <p>
          Feature requests or support:{" "}
          <a className="text-link" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <a
          className="landing-badge"
          href="https://circlesaasboard.com/startup/quirkle-2c895f"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://circlesaasboard.com/badge.svg"
            alt="Featured on CircleSaaS"
            width="220"
            height="84"
          />
        </a>
      </footer>
    </main>
  );
}
