import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";

const BUCKETS = [
  { n: 1, wait: "1 day", hint: "just learning" },
  { n: 2, wait: "3 days", hint: "getting familiar" },
  { n: 3, wait: "7 days", hint: "starting to stick" },
  { n: 4, wait: "14 days", hint: "resting" },
];

export default function SpacedRepetitionPage() {
  return (
    <main className="sr-page">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <header className="sr-head">
        <p className="eyebrow">How it works</p>
        <h1>Spaced repetition</h1>
        <p className="sr-head__lede">
          Every card lives in a bucket. Get it right, and it moves to the next
          one — which waits longer before it comes back. Miss it, and it drops
          back, so you’ll see it sooner.
        </p>
      </header>

      <section
        className="sr-play"
        aria-label="A card starts in bucket 1, due in one day. Each right answer moves it to the next bucket: 3 days, then 7, then 14. A wrong answer drops it back a bucket."
      >
        <div className="sr-play__stage">
          <div className="sr-rack" aria-hidden="true">
            {BUCKETS.map((bucket) => (
              <div
                className={`sr-bin sr-bin--${bucket.n}`}
                key={bucket.n}
              >
                <div className="sr-bin__well" />
                <strong>Bucket {bucket.n}</strong>
                <span>Back in {bucket.wait}</span>
              </div>
            ))}

            <article className="sr-card">
              <div className="sr-card__flip">
                <span className="sr-card__face sr-card__face--front">
                  <small>Question</small>
                  <p>When is National Donut Day?</p>
                </span>
                <span className="sr-card__face sr-card__face--back">
                  <small>Answer</small>
                  <p>The first Friday in June.</p>
                </span>
              </div>
              <span className="sr-card__mark sr-card__mark--right">✓</span>
              <span className="sr-card__mark sr-card__mark--wrong">×</span>
            </article>
          </div>
        </div>

        <div className="sr-captions">
          <p className="sr-caption sr-caption--1">
            New cards start in Bucket 1. They come back tomorrow.
          </p>
          <p className="sr-caption sr-caption--2">
            Got it right — it moves to Bucket 2, which waits 3 days.
          </p>
          <p className="sr-caption sr-caption--3">
            Keep getting it right, and it climbs. Bucket 3 waits a week.
            Bucket 4 waits two weeks.
          </p>
          <p className="sr-caption sr-caption--4">
            Miss it, and it drops back a bucket, so it returns sooner.
          </p>
        </div>
      </section>

      <ol className="sr-guide">
        {BUCKETS.map((bucket) => (
          <li className={`sr-guide__item sr-guide__item--${bucket.n}`} key={bucket.n}>
            <strong>Bucket {bucket.n}</strong>
            <span>{bucket.wait}</span>
            <em>{bucket.hint}</em>
          </li>
        ))}
      </ol>

      <p className="sr-note">
        You only study what’s due. Right moves the card up a bucket. Wrong
        moves it down. That’s the whole technique: review at the edge of
        forgetting, then get on with your day.
      </p>

      <div className="sr-actions">
        <Link className="button button--vermilion" to="/login">
          Begin writing
          <span aria-hidden="true">→</span>
        </Link>
        <Link className="text-link" to="/">
          Back to Quirkle
        </Link>
      </div>
    </main>
  );
}
