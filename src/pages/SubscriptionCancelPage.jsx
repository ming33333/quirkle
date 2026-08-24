import { Link } from "react-router-dom";

export default function SubscriptionCancelPage() {
  return (
    <main className="profile">
      <header className="profile__top">
        <div>
          <p className="eyebrow">Subscription</p>
          <h1>Checkout canceled</h1>
          <p className="profile__lede">
            Nothing was charged. You can subscribe anytime from your profile.
          </p>
        </div>
      </header>
      <div className="profile__actions">
        <Link className="button button--ink" to="/profile">
          Back to profile
        </Link>
        <Link className="text-link" to="/dashboard">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
