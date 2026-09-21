import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import SpacedRepetitionPlay from "../components/SpacedRepetitionPlay.jsx";
import { isAdmin } from "../utils/admins";
import {
  MONTHLY_PRICE_USD,
  freePlanDeckLabel,
  prefetchSubscriptionDetails,
  YEARLY_PRICE_USD,
  YEARLY_SAVINGS_PERCENT,
} from "../utils/subscription";

const STEPS = [
  {
    n: "01",
    title: "Write the cards",
    body: "Type them, or paste a spreadsheet.",
  },
  {
    n: "02",
    title: "Study what’s due",
    body: "Only fading cards come back.",
  },
  {
    n: "03",
    title: "Right climbs. Wrong returns.",
    body: "Hits wait longer. Misses come sooner.",
  },
];

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

function PlanCta({ user, subscribeTo, className, children }) {
  if (user) {
    return (
      <Link className={className} to={subscribeTo}>
        {children}
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <SignInCta className={className}>
      {children}
      <span aria-hidden="true">→</span>
    </SignInCta>
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

  const subscribeTo = user
    ? { pathname: "/profile", state: { background: location } }
    : "/login";

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
                onFocus={() => prefetchSubscriptionDetails(user.email)}
                onMouseEnter={() => prefetchSubscriptionDetails(user.email)}
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
            <>
              <button
                className="text-link text-link--button"
                onClick={() => scrollToId("pricing")}
                type="button"
              >
                Pricing
              </button>
              <SignInCta className="button button--ink button--small">
                Sign in
              </SignInCta>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>
          <span>Study less.</span>
          <span>Remember more.</span>
        </h1>
        <p className="hero__lede">
          Quirkle uses{" "}
          <Link className="hero__how text-link" to="/spaced-repetition">
            {"spaced repetition"}
          </Link>
          , so a card only comes back when you’re about to forget it. Write
          once. Review what’s due. Close the notebook.{" "}
          <Link className="hero__how text-link" to="/how-to">
            Yeah, but how?
          </Link>
        </p>
        <div className="hero__actions">
          <PrimaryCta user={user}>
            {user ? "Open your decks" : "Start a free deck"}
          </PrimaryCta>
        </div>
      </section>

      <section className="landing-band" id="how">
        <header className="landing-copy">
          <p className="eyebrow">How it works</p>
          <h2>Three steps. Then you’re done for the day.</h2>
        </header>
        <ol className="landing-steps">
          {STEPS.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <SpacedRepetitionPlay />
        <p className="landing-band__more">
          <Link className="text-link" to="/how-to">
            How to use Quirkle
          </Link>
          <Link className="text-link" to="/spaced-repetition">
            Watch the buckets
          </Link>
        </p>
      </section>

      <section className="landing-copy landing-copy--narrow">
        <p className="eyebrow">Why this, why now</p>
        <h2>Cramming feels like studying. It isn’t.</h2>
        <p>
          Most apps become another feed — streaks, leaderboards, a dozen buttons.
          You re-read the whole pile, including what you already know. It feels
          productive. Then it evaporates overnight.
        </p>
        <p>
          The forgetting starts as soon as you close the book. Quirkle is built
          for that moment: a quiet notebook that only asks for the cards that
          are about to fade.
        </p>
      </section>

      <section className="landing-copy">
        <p className="eyebrow">Can I trust this?</p>
        <h2>Built by someone who wanted a quiet notebook.</h2>
        <blockquote className="landing-quote">
          <p>
            I looked for a place to write flashcards and actually review them —
            spaced, simple, without a feed or a streak leaderboard. I couldn’t
            find one that stayed out of the way, so I made Quirkle.
          </p>
          <cite>
            <Link className="text-link" to="/lucky-software">
              Lucky Software
            </Link>
          </cite>
        </blockquote>
        <ul className="landing-facts">
          <li>No feed, no streak leaderboard, no extra chrome.</li>
          <li>You only study what’s due — right climbs, wrong returns sooner.</li>
          <li>
            Free for {freePlanDeckLabel}. Sign in with Google. No credit card to
            start.
          </li>
        </ul>
      </section>

      <section className="landing-band" id="pricing">
        <header className="landing-copy">
          <p className="eyebrow">Can I afford it?</p>
          <h2>Start free. Subscribe when one deck isn’t enough.</h2>
        </header>
        <div className="landing-plans">
          <article className="landing-plan">
            <p className="eyebrow">Free</p>
            <p className="landing-plan__price">$0</p>
            <p className="landing-plan__note">
              {freePlanDeckLabel}, full spaced repetition.
            </p>
            <PrimaryCta user={user}>
              {user ? "Open your decks" : "Start free"}
            </PrimaryCta>
          </article>
          <article className="landing-plan">
            <p className="eyebrow">Monthly</p>
            <p className="landing-plan__price">
              ${MONTHLY_PRICE_USD}
              <small>/month</small>
            </p>
            <p className="landing-plan__note">Unlimited decks. Cancel anytime.</p>
            <PlanCta
              className="button button--paper"
              subscribeTo={subscribeTo}
              user={user}
            >
              Subscribe monthly
            </PlanCta>
          </article>
          <article className="landing-plan landing-plan--paid">
            <p className="eyebrow">Yearly</p>
            <p className="landing-plan__price">
              ${YEARLY_PRICE_USD}
              <small>/year</small>
            </p>
            <p className="landing-plan__note">
              Unlimited decks. Save {YEARLY_SAVINGS_PERCENT}% vs monthly.
            </p>
            <PlanCta
              className="button button--ink"
              subscribeTo={subscribeTo}
              user={user}
            >
              Subscribe yearly
            </PlanCta>
          </article>
        </div>
      </section>

      <section className="landing-close">
        <p className="eyebrow">Do I need this now?</p>
        <h2>What you learned today is already fading.</h2>
        <p>
          Write the cards while the material is still warm. The schedule does
          the rest.
        </p>
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
          <a className="text-link" href="mailto:quirkle.it.support@gmail.com">
            quirkle.it.support@gmail.com
          </a>
        </p>
      </footer>
    </main>
  );
}
