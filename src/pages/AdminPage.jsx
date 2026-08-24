import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImpersonation } from "../context/ImpersonationContext.jsx";
import { addAdmin, listAdmins, removeAdmin } from "../utils/admins";
import { listUsersWithPlans, setPlanToFree } from "../utils/subscription";

const USER_PAGE_SIZE = 10;

export default function AdminPage({ user }) {
  const navigate = useNavigate();
  const { impersonatedEmail, startImpersonation, stopImpersonation } =
    useImpersonation();
  const email = user?.email || "";

  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [viewAsEmail, setViewAsEmail] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(USER_PAGE_SIZE);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await listAdmins();
      setAdmins(list);
    } catch (loadError) {
      console.error("Error loading admins:", loadError);
      setError("Could not load admins.");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const list = await listUsersWithPlans();
      setUsers(list);
    } catch (loadError) {
      console.error("Error loading users:", loadError);
      setError("Could not load users.");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleAdd = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const added = await addAdmin(newEmail);
      setNewEmail("");
      setMessage(`${added} is now an admin.`);
      await loadAdmins();
    } catch (addError) {
      setError(addError.message || "Could not add admin.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (adminEmail) => {
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await removeAdmin(adminEmail);
      setMessage(`${adminEmail} was removed.`);
      await loadAdmins();
    } catch (removeError) {
      setError(removeError.message || "Could not remove admin.");
    } finally {
      setSaving(false);
    }
  };

  const handleViewAs = async (event, presetEmail) => {
    event.preventDefault();
    const targetEmail = presetEmail ?? viewAsEmail;
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const target = await startImpersonation(targetEmail);
      setViewAsEmail("");
      setMessage(`Now viewing as ${target}.`);
      navigate("/dashboard");
    } catch (viewError) {
      setError(viewError.message || "Could not start view-as.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetFree = async (targetEmail) => {
    if (saving) return;
    const confirmed = window.confirm(
      `Cancel subscription for ${targetEmail} and set them to Free?`,
    );
    if (!confirmed) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await setPlanToFree(targetEmail);
      setUsers((current) =>
        current.map((row) =>
          row.email.toLowerCase() === targetEmail.toLowerCase()
            ? { ...row, status: "free", plan: "Free" }
            : row,
        ),
      );
      setMessage(
        result?.warning
          ? `${targetEmail} is Free in the app. ${result.warning}`
          : `${targetEmail} is now on the Free plan.`,
      );
    } catch (cancelError) {
      setError(cancelError.message || "Could not cancel subscription.");
    } finally {
      setSaving(false);
    }
  };

  const subscribedCount = users.filter((row) => row.plan === "Subscribed").length;
  const filteredUsers = users.filter((row) => {
    const q = userQuery.trim().toLowerCase();
    const matchesQuery = !q || row.email.toLowerCase().includes(q);
    const matchesPlan =
      planFilter === "all" ||
      (planFilter === "subscribed" && row.plan === "Subscribed") ||
      (planFilter === "free" && row.plan === "Free");
    return matchesQuery && matchesPlan;
  });
  const visibleUsers = filteredUsers.slice(0, visibleCount);
  const remaining = filteredUsers.length - visibleUsers.length;

  return (
    <main className="admin">
      <header className="admin__top">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Admin</h1>
          <p className="admin__lede">
            Signed in as <strong>{email}</strong>. Review every account and
            plan, view as a user, or grant admin access.
          </p>
        </div>
        <button
          className="text-link text-link--button"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          Dashboard
        </button>
      </header>

      <section className="admin__panel">
        <div className="admin__heading">
          <h2>Users & plans</h2>
          <span>
            {usersLoading
              ? "…"
              : `${users.length} users · ${subscribedCount} subscribed`}
          </span>
        </div>
        <p className="admin__muted">
          Everyone in the users collection, with their current subscription
          plan.
        </p>

        <div className="admin__user-tools">
          <label className="admin__search">
            Search
            <input
              onChange={(event) => {
                setUserQuery(event.target.value);
                setVisibleCount(USER_PAGE_SIZE);
              }}
              placeholder="Filter by email"
              type="search"
              value={userQuery}
            />
          </label>
          <div className="admin__plan-filters" role="group" aria-label="Plan filter">
            {[
              { value: "all", label: "All" },
              { value: "subscribed", label: "Subscribed" },
              { value: "free", label: "Free" },
            ].map((option) => (
              <button
                className={`admin__chip${
                  planFilter === option.value ? " admin__chip--active" : ""
                }`}
                key={option.value}
                onClick={() => {
                  setPlanFilter(option.value);
                  setVisibleCount(USER_PAGE_SIZE);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {usersLoading ? (
          <p className="admin__muted">Loading users…</p>
        ) : filteredUsers.length === 0 ? (
          <p className="admin__muted">No users match this filter.</p>
        ) : (
          <>
            <ul className="admin-list admin-list--users">
              {visibleUsers.map((row) => (
                <li key={row.email}>
                  <div>
                    <strong>{row.email}</strong>
                    <span
                      className={`admin-plan${
                        row.plan === "Subscribed" ? " admin-plan--paid" : ""
                      }`}
                    >
                      {row.plan}
                    </span>
                  </div>
                  <div className="admin-list__actions">
                    {row.plan === "Subscribed" ? (
                      <button
                        className="text-link text-link--button"
                        disabled={saving}
                        onClick={() => handleSetFree(row.email)}
                        type="button"
                      >
                        Set to free
                      </button>
                    ) : null}
                    <button
                      className="text-link text-link--button"
                      disabled={saving}
                      onClick={(event) => handleViewAs(event, row.email)}
                      type="button"
                    >
                      View as
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {remaining > 0 ? (
              <button
                className="button button--paper admin__load-more"
                onClick={() =>
                  setVisibleCount((count) => count + USER_PAGE_SIZE)
                }
                type="button"
              >
                Load more ({remaining} left)
              </button>
            ) : null}
          </>
        )}
      </section>

      <section className="admin__panel">
        <h2>View as user</h2>
        <p className="admin__muted">
          Open their dashboard and decks without signing out. Admin stays on
          your real account.
        </p>
        {impersonatedEmail ? (
          <div className="admin__viewing">
            <p>
              Currently viewing as <strong>{impersonatedEmail}</strong>
            </p>
            <div className="admin__viewing-actions">
              <button
                className="button button--paper"
                onClick={() => navigate("/dashboard")}
                type="button"
              >
                Open dashboard
              </button>
              <button
                className="button button--ink"
                onClick={stopImpersonation}
                type="button"
              >
                Stop viewing as
              </button>
            </div>
          </div>
        ) : (
          <form className="admin__form" onSubmit={handleViewAs}>
            <label>
              User email
              <input
                autoComplete="email"
                onChange={(event) => setViewAsEmail(event.target.value)}
                placeholder="user@example.com"
                type="email"
                value={viewAsEmail}
              />
            </label>
            <button
              className="button button--ink"
              disabled={saving || !viewAsEmail.trim()}
              type="submit"
            >
              {saving ? "Starting…" : "View as user"}
            </button>
          </form>
        )}
      </section>

      <section className="admin__panel">
        <h2>Add admin</h2>
        <form className="admin__form" onSubmit={handleAdd}>
          <label>
            Email
            <input
              autoComplete="email"
              onChange={(event) => setNewEmail(event.target.value)}
              placeholder="name@example.com"
              type="email"
              value={newEmail}
            />
          </label>
          <button
            className="button button--ink"
            disabled={saving || !newEmail.trim()}
            type="submit"
          >
            {saving ? "Saving…" : "Add admin"}
          </button>
        </form>
      </section>

      {(error || message) && (
        <p className={error ? "admin__error" : "admin__message"}>
          {error || message}
        </p>
      )}

      <section className="admin__panel">
        <div className="admin__heading">
          <h2>Current admins</h2>
          <span>{admins.length}</span>
        </div>

        {loading ? (
          <p className="admin__muted">Loading admins…</p>
        ) : admins.length === 0 ? (
          <p className="admin__muted">No admins yet.</p>
        ) : (
          <ul className="admin-list">
            {admins.map((admin) => {
              const isYou =
                admin.email.toLowerCase() === email.toLowerCase();
              return (
                <li key={admin.email}>
                  <div>
                    <strong>{admin.email}</strong>
                    {isYou ? <span>you</span> : null}
                  </div>
                  <button
                    className="text-link text-link--button"
                    disabled={saving || admins.length <= 1}
                    onClick={() => handleRemove(admin.email)}
                    type="button"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
