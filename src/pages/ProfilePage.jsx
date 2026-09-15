import { useEffect, useRef, useState } from "react";
import {
  FREE_PLAN_MAX_DECKS,
  cancelSubscriptionAtPeriodEnd,
  getSubscriptionDetails,
  isSubscribed,
  MAX_QUESTIONS_PER_DECK,
  MONTHLY_PRICE_USD,
  openCustomerPortal,
  planLabel,
  startCheckout,
  YEARLY_BILLED_MONTHLY_USD,
  YEARLY_PRICE_USD,
  YEARLY_SAVINGS_PERCENT,
} from "../utils/subscription";

const formatRenewalDate = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function ProfilePage({ onClose, user }) {
  const email = user?.email || "";
  const panelRef = useRef(null);
  const [status, setStatus] = useState("free");
  const [nextRenewalAt, setNextRenewalAt] = useState(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [planInterval, setPlanInterval] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
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
        const details = await getSubscriptionDetails(email);
        if (!cancelled) {
          setStatus(details.status || "free");
          setNextRenewalAt(details.nextRenewalAt || null);
          setCancelAtPeriodEnd(Boolean(details.cancelAtPeriodEnd));
          setPlanInterval(details.interval || null);
        }
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
  const renewalLabel = formatRenewalDate(nextRenewalAt);

  const handleSubscribe = async (planInterval = "year") => {
    if (working) return;
    setWorking(true);
    setError("");
    setMessage("");
    try {
      await startCheckout(email, { interval: planInterval });
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
    setMessage("");
    try {
      await openCustomerPortal(email);
    } catch (portalError) {
      console.error("Portal error:", portalError);
      setError(portalError.message || "Could not open billing.");
      setWorking(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (working || cancelAtPeriodEnd) return;
    const confirmed = window.confirm(
      "Cancel your subscription? You’ll keep access until the end of this billing period, then you won’t be charged again.",
    );
    if (!confirmed) return;
    setWorking(true);
    setError("");
    setMessage("");
    try {
      const result = await cancelSubscriptionAtPeriodEnd(email);
      setStatus(result.status || "subscribed");
      setCancelAtPeriodEnd(true);
      setNextRenewalAt(result.nextRenewalAt || nextRenewalAt);
      setMessage(
        "Cancellation scheduled. You won’t be charged again after this period.",
      );
    } catch (cancelError) {
      console.error("Cancel error:", cancelError);
      setError(cancelError.message || "Could not cancel subscription.");
    } finally {
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
              {subscribed && planInterval ? (
                <p className="profile__interval">
                  {planInterval === "year" ? "Yearly" : "Monthly"}
                </p>
              ) : null}
              {subscribed && renewalLabel ? (
                <p className="profile__renewal">
                  {cancelAtPeriodEnd
                    ? `Ends on ${renewalLabel}`
                    : `Renews on ${renewalLabel}`}
                </p>
              ) : null}
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
              {message && <p className="profile__message">{message}</p>}
              {impersonating ? (
                <p className="profile__muted">
                  Stop viewing to manage your own billing.
                </p>
              ) : subscribed ? (
                <div className="profile__actions">
                  <button
                    className="button button--ink"
                    disabled={working}
                    onClick={handleManage}
                    type="button"
                  >
                    {working ? "Opening…" : "Manage billing"}
                  </button>
                  {!cancelAtPeriodEnd ? (
                    <button
                      className="button button--paper"
                      disabled={working}
                      onClick={handleCancelSubscription}
                      type="button"
                    >
                      Cancel subscription
                    </button>
                  ) : (
                    <p className="profile__muted">
                      Cancellation is scheduled. Access lasts until the end
                      date above.
                    </p>
                  )}
                </div>
              ) : (
                <div className="profile__actions profile__actions--plans">
                  <div className="profile__offer">
                    <p className="profile__offer-price">
                      <span>${YEARLY_PRICE_USD}/year</span>
                      <s>${YEARLY_BILLED_MONTHLY_USD}/year</s>
                    </p>
                    <p className="profile__offer-save">
                      Save {YEARLY_SAVINGS_PERCENT}% compared to monthly
                      billing
                    </p>
                  </div>
                  <button
                    className="button button--ink button--full"
                    disabled={working}
                    onClick={() => handleSubscribe("year")}
                    type="button"
                  >
                    {working ? "Redirecting…" : "Subscribe yearly"}
                  </button>
                  <button
                    className="button button--paper button--full"
                    disabled={working}
                    onClick={() => handleSubscribe("month")}
                    type="button"
                  >
                    {working
                      ? "Redirecting…"
                      : `Subscribe monthly · $${MONTHLY_PRICE_USD}`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
