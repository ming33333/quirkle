export const SR_BUCKETS = [
  { n: 1, wait: "2 days", hint: "just learning" },
  { n: 2, wait: "4 days", hint: "getting familiar" },
  { n: 3, wait: "8 days", hint: "starting to stick" },
  { n: 4, wait: "16 days", hint: "resting" },
];

export const SR_CYCLE_MS = 24000;

export default function SpacedRepetitionPlay() {
  return (
    <section
      className="sr-play"
      aria-label="A card starts in bucket 1, due in two days. Each right answer moves it to the next bucket: 4 days, then 8, then 16. A wrong answer drops it back a bucket."
    >
      <div className="sr-play__stage">
        <div className="sr-rack" aria-hidden="true">
          {SR_BUCKETS.map((bucket) => (
            <div className={`sr-bin sr-bin--${bucket.n}`} key={bucket.n}>
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
          New cards start in Bucket 1. They come back in 2 days.
        </p>
        <p className="sr-caption sr-caption--2">
          Got it right — it moves to Bucket 2, which waits 4 days.
        </p>
        <p className="sr-caption sr-caption--3">
          Keep getting it right, and it climbs. Bucket 3 waits 8 days.
          Bucket 4 waits 16 days.
        </p>
        <p className="sr-caption sr-caption--4">
          Miss it, and it drops back a bucket, so it returns sooner.
        </p>
      </div>
    </section>
  );
}
