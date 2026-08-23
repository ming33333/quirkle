import { Link } from "react-router-dom";

export default function Brand({ compact = false }) {
  return (
    <Link className={`brand${compact ? " brand--compact" : ""}`} to="/">
      <span className="brand__seal" aria-hidden="true">
        記
      </span>
      <span>
        <strong>Quirkle</strong>
        {!compact && <small>quiet notes, lasting memory</small>}
      </span>
    </Link>
  );
}
