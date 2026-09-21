import { Link } from "react-router-dom";

export default function GuestSampleBanner() {
  return (
    <div className="guest-banner">
      <p>
        This is a sample. Edit it, run a test — sign in with Google when you
        want to keep it.
      </p>
      <Link
        className="button button--vermilion button--small"
        state={{ from: "/try" }}
        to="/login"
      >
        Keep this notebook
      </Link>
    </div>
  );
}
