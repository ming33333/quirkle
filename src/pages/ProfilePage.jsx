import { useEffect, useRef, useState } from "react";
import {
  FREE_PLAN_MAX_DECKS,
  getSubscriptionStatus,
  isSubscribed,
  MAX_QUESTIONS_PER_DECK,
  openCustomerPortal,
  planLabel,
  startCheckout,
} from "../utils/subscription";

export default function ProfilePage({ onClose, user }) {
  const email = user?.email || "";
  const panelRef = useRef(null);
  const [status, setStatus] = useState("free");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!email) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const nextStatus = await getSubscriptionStatus(email);
        if (!cancelled) setStatus(nextStatus);
      } catch (loadError) {
        console.error("Error loading profile:", loadError);
        if (!cancelled) setError("Could not load your plan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [email]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("button")?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const subscribed = isSubscribed(status);
  const impersonating = Boolean(user?.isImpersonating);

  const handleSubscribe = async () => {
    if (working) return;
    setWorking(true);
    setError("");
    try {
      await startCheckout(email);
    } catch (checkoutError) {
      console.error("Checkout error:", checkoutError);
      setError(checkoutError.message || "Could not start checkout.");
      setWorking(false);
    }
  };

  const handleManage = async () => {
    if (working) return;
    setWorking(true);
    setError("");
    try {
      await openCustomerPortal(email);
    } catch (portalError) {
      console.error("Portal error:", portalError);
      setError(portalError.message || "Could not open billing.");
      setWorking(false);
    }
  };

  return (
    <div
      className="profile-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="profile-overlay__panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        <button
          className="profile-overlay__close"
          onClick={onClose}
          type="button"
          aria-label="Close profile"
        >
          ×
        </button>
        <p className="eyebrow">Account</p>
        <h1 id="profile-title">Profile</h1>
        <p className="profile__lede">
          {impersonating ? "Viewing" : "Signed in as"} <strong>{email}</strong>
        </p>

        <section className="profile__panel">
          <h2>Plan</h2>
          {loading ? (
            <p className="profile__muted">Loading…</p>
          ) : (
            <>
              <p className="profile__plan">{planLabel(status)}</p>
              {!subscribed && (
                <p className="profile__muted">
                  Free accounts can keep {FREE_PLAN_MAX_DECKS} decks. Subscribed
                  accounts can make as many decks as they need.
                </p>
              )}
              <p className="profile__note">
                Every deck is limited to {MAX_QUESTIONS_PER_DECK} questions.
              </p>
              {error && <p className="profile__error">{error}</p>}
              {impersonating ? (
                <p className="profile__muted">
                  Stop viewing to manage your own billing.
                </p>
              ) : subscribed ? (
                <button
                  className="button button--ink"
                  disabled={working}
                  onClick={handleManage}
                  type="button"
                >
                  {working ? "Opening…" : "Manage billing"}
                </button>
              ) : (
                <button
                  className="button button--ink"
                  disabled={working}
                  onClick={handleSubscribe}
                  type="button"
                >
                  {working ? "Redirecting…" : "Subscribe"}
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
