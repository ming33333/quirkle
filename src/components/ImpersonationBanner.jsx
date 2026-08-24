import { useImpersonation } from "../context/ImpersonationContext.jsx";

export default function ImpersonationBanner() {
  const { impersonatedEmail, stopImpersonation } = useImpersonation();

  if (!impersonatedEmail) return null;

  return (
    <div className="impersonation-banner" role="status">
      <p>
        Viewing as <strong>{impersonatedEmail}</strong>
      </p>
      <button
        className="button button--paper button--small"
        onClick={stopImpersonation}
        type="button"
      >
        Stop
      </button>
    </div>
  );
}
