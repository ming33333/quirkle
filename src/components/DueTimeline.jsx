import { useCallback, useMemo, useRef, useState } from "react";
import {
  countDueByBucketThrough,
  getTimelineSpanDays,
} from "../utils/studyInsights";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

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
  const today = useMemo(() => startOfToday(), []);
  const spanDays = useMemo(() => getTimelineSpanDays(cards), [cards]);
  const [dayOffset, setDayOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const selectedDate = useMemo(
    () => addDays(today, dayOffset),
    [dayOffset, today],
  );

  const summary = useMemo(
    () => countDueByBucketThrough(cards, selectedDate),
    [cards, selectedDate],
  );

  const ticks = useMemo(() => {
    const count = Math.min(6, spanDays + 1);
    const step = spanDays / Math.max(1, count - 1);
    return Array.from({ length: count }, (_, index) => {
      const offset = Math.round(index * step);
      return {
        offset,
        date: addDays(today, offset),
        left: `${(offset / spanDays) * 100}%`,
      };
    });
  }, [spanDays, today]);

  const markerLeft = `${(dayOffset / spanDays) * 100}%`;

  const dayFromClientX = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return dayOffset;
      const { left, width } = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
      return Math.round(ratio * spanDays);
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
        <p>Drag the arrow to see what comes due by a date.</p>
      </div>

      <div
        className="due-timeline__track-wrap"
        onPointerDown={onTrackPointerDown}
        ref={trackRef}
      >
        <div className="due-timeline__track" aria-hidden="true">
          {ticks.map((tick) => (
            <span
              className="due-timeline__tick"
              key={tick.offset}
              style={{ left: tick.left }}
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
          style={{ left: markerLeft }}
          type="button"
        >
          <span aria-hidden="true" />
        </button>
      </div>

      <div className="due-timeline__summary">
        <p className="due-timeline__window">{windowLabel}</p>
        <p className="due-timeline__counts">
          <strong>{summary.total}</strong>{" "}
          {summary.total === 1 ? "card" : "cards"} — {formatBucketSummary(summary.buckets)}
        </p>
      </div>
    </section>
  );
}
