import { Link } from "react-router-dom";

export default function Brand({ compact = false }) {
  return (
    <Link className={`brand${compact ? " brand--compact" : ""}`} to="/">
      <span className="brand__seal" aria-hidden="true">
        <img alt="" src="/red_panda.jpg" />
      </span>
      <span>
        <strong>Quirkle</strong>
        {!compact && <small>A flashcard study nook</small>}
      </span>
    </Link>
  );
}
