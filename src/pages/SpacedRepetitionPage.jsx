import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import SpacedRepetitionPlay, {
  SR_BUCKETS,
} from "../components/SpacedRepetitionPlay.jsx";

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

      <SpacedRepetitionPlay />

      <ol className="sr-guide">
        {SR_BUCKETS.map((bucket) => (
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
