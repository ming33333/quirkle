import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { isAdmin } from "../utils/admins";

function WriteCard({ n, question, answer }) {
  return (
    <div className={`story-write story-write--${n}`}>
      <div className="story-flip story-flip--write">
        <span className="story-flip__face story-flip__face--front">
          <small>Question</small>
          <p className={`story-type story-type--q${n}`}>{question}</p>
        </span>
        <span className="story-flip__face story-flip__face--back">
          <small>Answer</small>
          <p className={`story-type story-type--a${n}`}>{answer}</p>
        </span>
      </div>
    </div>
  );
}

function HeroStory() {
  return (
    <div
      className="hero-story"
      aria-label="Welcome to Quirkle. Dedicated to spaced learning: cards come back when they are due so each review sticks."
    >
      <div className="hero-story__scene hero-story__scene--welcome">
        <span className="hero-story__seal" aria-hidden="true" />
        <p className="hero-story__hello">Welcome to Quirkle</p>
        <p className="hero-story__note">
          Dedicated to spaced learning.
        </p>
        <p className="hero-story__explain">
          Cards come back when they’re due — just as they start to fade — so
          each review sticks and you study less as you remember more.
        </p>
      </div>

      <div className="hero-story__scene hero-story__scene--make">
        <p className="hero-story__caption">Write flashcards</p>
        <div className="story-write-deck" aria-hidden="true">
          <WriteCard
            n={1}
            question="When is National Donut Day?"
            answer="The first Friday in June."
          />
          <WriteCard
            n={2}
            question="How long is a marathon?"
            answer="26.2 miles."
          />
          <WriteCard
            n={3}
            question="What’s heavier, a pound of feathers or a pound of rocks?"
            answer="They weigh the same."
          />
        </div>
      </div>

      <div className="hero-story__scene hero-story__scene--study">
        <p className="hero-story__caption">Study time</p>
        <div className="story-nook" aria-hidden="true">
          <svg viewBox="0 0 380 280" fill="none">
            <g className="nook-float nook-float--1">
              <g transform="translate(18 108) rotate(-16)">
                <rect
                  width="86"
                  height="52"
                  rx="3"
                  fill="#f3eadc"
                  stroke="#2f373b"
                  strokeWidth="1.8"
                />
                <text
                  x="43"
                  y="16"
                  textAnchor="middle"
                  fill="#c64b38"
                  fontSize="5"
                  fontWeight="600"
                  letterSpacing="1"
                >
                  QUESTION
                </text>
                <text x="43" y="34" textAnchor="middle" fill="#252d31" fontSize="7">
                  When is National
                </text>
                <text x="43" y="44" textAnchor="middle" fill="#252d31" fontSize="7">
                  Donut Day?
                </text>
                <g className="nook-mark nook-mark--right">
                  <circle cx="104" cy="26" r="10" fill="#6f8f7a" stroke="#2f373b" strokeWidth="1.6" />
                  <path
                    d="M99 26 L102.5 30 L110 21"
                    stroke="#fffcf5"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </g>

            <g className="nook-float nook-float--2">
              <g transform="translate(78 62) rotate(10)">
                <rect
                  width="86"
                  height="52"
                  rx="3"
                  fill="#fffcf5"
                  stroke="#2f373b"
                  strokeWidth="1.8"
                />
                <text
                  x="43"
                  y="16"
                  textAnchor="middle"
                  fill="#c64b38"
                  fontSize="5"
                  fontWeight="600"
                  letterSpacing="1"
                >
                  QUESTION
                </text>
                <text x="43" y="34" textAnchor="middle" fill="#252d31" fontSize="7">
                  How long is a
                </text>
                <text x="43" y="44" textAnchor="middle" fill="#252d31" fontSize="7">
                  marathon?
                </text>
                <g className="nook-mark nook-mark--wrong">
                  <circle cx="104" cy="26" r="10" fill="#c64b38" stroke="#2f373b" strokeWidth="1.6" />
                  <path
                    d="M99.5 21.5 L108.5 30.5 M108.5 21.5 L99.5 30.5"
                    stroke="#fffcf5"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </g>

            <g className="nook-float nook-float--3">
              <g transform="translate(42 36) rotate(-4)">
                <rect
                  width="96"
                  height="58"
                  rx="3"
                  fill="#fffcf5"
                  stroke="#2f373b"
                  strokeWidth="2"
                />
                <text
                  x="48"
                  y="16"
                  textAnchor="middle"
                  fill="#c64b38"
                  fontSize="5.5"
                  fontWeight="600"
                  letterSpacing="1.2"
                >
                  QUESTION
                </text>
                <text x="48" y="32" textAnchor="middle" fill="#252d31" fontSize="7.4">
                  <tspan x="48" dy="0">What’s heavier,</tspan>
                  <tspan x="48" dy="10">feathers or rocks?</tspan>
                </text>
                <g className="nook-mark nook-mark--right nook-mark--late">
                  <circle cx="114" cy="29" r="11" fill="#6f8f7a" stroke="#2f373b" strokeWidth="1.6" />
                  <path
                    d="M108 29 L112 33 L120 24"
                    stroke="#fffcf5"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </g>

            <g
              transform="translate(268 86)"
              stroke="#2f373b"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <ellipse cx="24" cy="164" rx="22" ry="4.5" fill="#e4d9c4" stroke="none" />
              <circle cx="24" cy="24" r="16" fill="#fffcf5" />
              <circle cx="17.5" cy="22.5" r="4.1" fill="#fff" stroke="none" />
              <circle cx="30.5" cy="22.5" r="4.1" fill="#fff" stroke="none" />
              <circle cx="16.4" cy="22.5" r="1.7" fill="#2f373b" stroke="none" />
              <circle cx="29.4" cy="22.5" r="1.7" fill="#2f373b" stroke="none" />
              <circle cx="17.5" cy="22.5" r="5.5" fill="none" strokeWidth="1.8" />
              <circle cx="30.5" cy="22.5" r="5.5" fill="none" strokeWidth="1.8" />
              <line x1="23" y1="22.5" x2="25" y2="22.5" strokeWidth="1.8" />
              <line x1="12" y1="21.8" x2="8.6" y2="20" strokeWidth="1.6" />
              <line x1="36" y1="21.8" x2="39.4" y2="20" strokeWidth="1.6" />
              <line x1="24" y1="40" x2="24" y2="102" />
              <line x1="24" y1="62" x2="4" y2="44" />
              <line x1="24" y1="62" x2="44" y2="86" />
              <line x1="24" y1="102" x2="10" y2="148" />
              <line x1="24" y1="102" x2="38" y2="148" />
            </g>
          </svg>
        </div>
      </div>
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
      </footer>
    </main>
  );
}
