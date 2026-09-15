import { useCallback, useMemo, useRef, useState } from "react";
import {
  buildDueDistribution,
  countDueByBucketThrough,
} from "../utils/studyInsights";

const formatShortDate = (date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

const formatBucketSummary = (buckets) => {
  const parts = [1, 2, 3, 4]
    .filter((bucket) => buckets[bucket] > 0)
    .map((bucket) => `${buckets[bucket]} in bucket ${bucket}`);
  return parts.length ? parts.join(", ") : "Nothing due in this window.";
};

export default function DueTimeline({ cards }) {
  const trackRef = useRef(null);
  const [dayOffset, setDayOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const distribution = useMemo(() => buildDueDistribution(cards), [cards]);
  const { days, spanDays, maxCount } = distribution;
  const selectedDate = days[dayOffset]?.date || days[0]?.date;
  const selectedDay = days[dayOffset] || days[0];
  const barMax = Math.max(1, maxCount);
  const dense = spanDays > 40;

  const summary = useMemo(
    () => countDueByBucketThrough(cards, selectedDate),
    [cards, selectedDate],
  );

  const ticks = useMemo(() => {
    const count = Math.min(6, spanDays + 1);
    const step = spanDays / Math.max(1, count - 1);
    const seen = new Set();
    return Array.from({ length: count }, (_, index) => {
      const offset = Math.round(index * step);
      return days[offset];
    }).filter((day) => {
      if (!day || seen.has(day.offset)) return false;
      seen.add(day.offset);
      return true;
    });
  }, [days, spanDays]);

  const markerLeft = `${((dayOffset + 0.5) / (spanDays + 1)) * 100}%`;

  const dayFromClientX = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return dayOffset;
      const { left, width } = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(0.999, (clientX - left) / width));
      return Math.max(0, Math.min(spanDays, Math.floor(ratio * (spanDays + 1))));
    },
    [dayOffset, spanDays],
  );

  const onTrackPointerDown = (event) => {
    if (event.target.closest(".due-timeline__handle")) return;
    setDayOffset(dayFromClientX(event.clientX));
  };

  const onHandlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onHandlePointerMove = (event) => {
    if (!dragging) return;
    setDayOffset(dayFromClientX(event.clientX));
  };

  const onHandlePointerUp = (event) => {
    if (!dragging) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  };

  const windowLabel =
    dayOffset === 0
      ? "Due today"
      : `Due through ${formatShortDate(selectedDate)}`;

  return (
    <section className="due-timeline" aria-label="Due date timeline">
      <div className="due-timeline__head">
        <h3>Due timeline</h3>
        <p>
          Each bar is cards due that day. Drag the arrow to see the total
          through a date.
        </p>
      </div>

      <div
        className="due-timeline__track-wrap"
        onPointerDown={onTrackPointerDown}
        ref={trackRef}
      >
        <div
          className={`due-timeline__chart${dense ? " due-timeline__chart--dense" : ""}`}
          aria-hidden="true"
        >
          {days.map((day) => {
            const selected = day.offset === dayOffset;
            const after = day.offset > dayOffset;
            return (
              <div
                className={`due-timeline__col${selected ? " is-selected" : ""}${
                  after ? " is-after" : ""
                }`}
                key={day.offset}
                title={
                  day.total
                    ? `${day.total} ${day.total === 1 ? "card" : "cards"} on ${formatShortDate(day.date)}`
                    : `Nothing due ${formatShortDate(day.date)}`
                }
              >
                {selected && day.total > 0 ? (
                  <b className="due-timeline__col-count">{day.total}</b>
                ) : null}
                <div
                  className="due-timeline__bar"
                  style={{
                    height: day.total ? `${(day.total / barMax) * 100}%` : 0,
                    minHeight: day.total ? 4 : 0,
                  }}
                >
                  {[1, 2, 3, 4].map((bucket) => {
                    const count = day.buckets[bucket];
                    if (!count) return null;
                    return (
                      <i
                        className={`due-timeline__seg due-timeline__seg--${bucket}`}
                        key={bucket}
                        style={{ flex: count }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="due-timeline__track" aria-hidden="true">
          {ticks.map((tick) => (
            <span
              className="due-timeline__tick"
              key={tick.offset}
              style={{
                left: `${((tick.offset + 0.5) / (spanDays + 1)) * 100}%`,
              }}
            >
              <i />
              <em>{formatShortDate(tick.date)}</em>
            </span>
          ))}
        </div>

        <button
          aria-label={`Due through ${formatShortDate(selectedDate)}`}
          aria-valuemax={spanDays}
          aria-valuemin={0}
          aria-valuenow={dayOffset}
          className={`due-timeline__handle${dragging ? " is-dragging" : ""}`}
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          onPointerCancel={onHandlePointerUp}
          style={{ left: markerLeft }}
          type="button"
        >
          <i aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div className="due-timeline__summary">
        <p className="due-timeline__window">{windowLabel}</p>
        <p className="due-timeline__counts">
          <strong>{selectedDay?.total || 0}</strong>{" "}
          {(selectedDay?.total || 0) === 1 ? "card" : "cards"} on{" "}
          {formatShortDate(selectedDate)}
          <span>
            {summary.total} through this date — {formatBucketSummary(summary.buckets)}
          </span>
        </p>
      </div>
    </section>
  );
}
