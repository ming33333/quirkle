import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";

export default function LandingPage({ user }) {
  return (
    <main className="landing">
      <nav className="site-nav">
        <Brand />
        <div className="site-nav__actions">
          {user ? (
            <Link className="button button--ink button--small" to="/dashboard">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link className="text-link" to="/login">
                Sign in
              </Link>
              <Link className="button button--ink button--small" to="/login">
                Begin writing
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">書く ・ 覚える — write, remember</p>
          <h1>
            A quiet place for
            <span>notes that stay with you.</span>
          </h1>
          <p className="hero__lede">
            Gather your thoughts, shape them into flashcards, and return to
            what matters—one small page at a time.
          </p>
          <div className="hero__actions">
            <Link
              className="button button--vermilion"
              to={user ? "/dashboard" : "/login"}
            >
              {user ? "Continue to dashboard" : "Start your first notebook"}
              <span aria-hidden="true">→</span>
            </Link>
            <a className="text-link text-link--large" href="#method">
              See the method
            </a>
          </div>
        </div>

        <div className="hero__notebook" aria-label="A sample study notebook">
          <div className="notebook__binding" />
          <div className="notebook__date">九月十四日</div>
          <p className="notebook__label">TODAY&apos;S NOTE</p>
          <h2>Small ideas become strong memories.</h2>
          <div className="notebook__rule" />
          <p>
            Write with intention. Turn the parts worth remembering into a
            simple question and answer.
          </p>
          <div className="notebook__card">
            <small>FLASHCARD 01</small>
            <strong>What helps a memory last?</strong>
            <span>Returning to it at the right time.</span>
          </div>
          <span className="notebook__stamp">復習</span>
        </div>
      </section>

      <section className="method" id="method">
        <p className="eyebrow">A simple rhythm</p>
        <div className="method__grid">
          <article>
            <span>一</span>
            <h3>Write freely</h3>
            <p>Capture a thought without fighting a crowded interface.</p>
          </article>
          <article>
            <span>二</span>
            <h3>Make it memorable</h3>
            <p>Lift key ideas into focused, useful flashcards.</p>
          </article>
          <article>
            <span>三</span>
            <h3>Return gently</h3>
            <p>Review a little at a time and let understanding accumulate.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
