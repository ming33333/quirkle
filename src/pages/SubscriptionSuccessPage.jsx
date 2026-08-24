import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmCheckoutSession } from "../utils/subscription";

const sessionIdFromLocation = (searchParams) => {
  const fromRouter = searchParams.get("session_id");
  if (fromRouter) return fromRouter;
  const query = window.location.hash.split("?")[1] || window.location.search.slice(1);
  return new URLSearchParams(query).get("session_id");
};

export default function SubscriptionSuccessPage({ user }) {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Confirming your subscription…");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const sessionId = sessionIdFromLocation(searchParams);
    const email = user?.email;

    const confirm = async () => {
      if (!email) {
        setError("You need to be signed in.");
        return;
      }
      if (!sessionId) {
        setMessage("If you just paid, open Profile in a moment — billing may still be catching up.");
        return;
      }
      try {
        await confirmCheckoutSession(email, sessionId);
        if (!cancelled) {
          setMessage("Billing is set. You can make as many decks as you need (still 200 questions per deck).");
        }
      } catch (confirmError) {
        console.error("Error confirming checkout:", confirmError);
        if (!cancelled) {
          setError(
            confirmError.message ||
              "Could not confirm yet. If you were charged, wait a minute and refresh Profile.",
          );
        }
      }
    };

    confirm();
    return () => {
      cancelled = true;
    };
  }, [searchParams, user]);

  return (
    <main className="profile">
      <header className="profile__top">
        <div>
          <p className="eyebrow">Subscription</p>
          <h1>You’re subscribed</h1>
          <p className="profile__lede">{message}</p>
          {error ? <p className="profile__error">{error}</p> : null}
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
