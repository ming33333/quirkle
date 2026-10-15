import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import {
  cancelSubscriptionAtPeriodEnd,
  getSubscriptionDetails,
  isSubscribed,
  isTester,
  MAX_DECKS,
  openCustomerPortal,
  peekSubscriptionDetails,
  planLabel,
  SUPPORT_EMAIL,
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
  const cached = peekSubscriptionDetails(email, { allowStale: true });
  const [status, setStatus] = useState(cached?.status || "free");
  const [nextRenewalAt, setNextRenewalAt] = useState(cached?.nextRenewalAt || null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(
    Boolean(cached?.cancelAtPeriodEnd),
  );
  const [planInterval, setPlanInterval] = useState(cached?.interval || null);
  const [loading, setLoading] = useState(!cached);
  const [working, setWorking] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const applyDetails = (details) => {
      setStatus(details.status || "free");
      setNextRenewalAt(details.nextRenewalAt || null);
      setCancelAtPeriodEnd(Boolean(details.cancelAtPeriodEnd));
      setPlanInterval(details.interval || null);
    };

    const load = async () => {
      if (!email) {
        setLoading(false);
        return;
      }
      const warm = peekSubscriptionDetails(email, { allowStale: true });
      if (warm) {
        applyDetails(warm);
        setLoading(false);
      } else {
        setLoading(true);
      }
      setError("");
      try {
        const details = await getSubscriptionDetails(email, {
          force: Boolean(warm) && !peekSubscriptionDetails(email),
        });
        if (!cancelled) {
          applyDetails(details);
        }
      } catch (loadError) {
        console.error("Error loading profile:", loadError);
        if (!cancelled && !warm) setError("Could not load your plan.");
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

  const tester = isTester(status);
  const subscribed = isSubscribed(status) && !tester;
  const impersonating = Boolean(user?.isImpersonating);
  const renewalLabel = formatRenewalDate(nextRenewalAt);

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

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setError("");
    setMessage("");
    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error("Sign out error:", signOutError);
      setError(signOutError.message || "Could not sign out.");
      setSigningOut(false);
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
              {tester ? (
                <p className="profile__muted">
                  Tester account. Full access, and this account is not billed.
                </p>
              ) : null}
              {!subscribed && !tester && (
                <p className="profile__muted">
                  Quirkle is free. An account can keep {MAX_DECKS} decks.
                  Message{" "}
                  <a className="text-link" href={`mailto:${SUPPORT_EMAIL}`}>
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  to raise the limit.
                </p>
              )}
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
              ) : null}
            </>
          )}
        </section>

        <div className="profile__session">
          <button
            className="button button--paper"
            disabled={signingOut}
            onClick={handleSignOut}
            type="button"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
