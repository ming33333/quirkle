import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Brand from "../components/Brand.jsx";
import { auth } from "../utils/firebase";

const readableAuthError = (error) => {
  const code = error?.code || "";
  if (code.includes("invalid-credential")) {
    return "That email or password does not match our records.";
  }
  if (code.includes("popup-closed")) {
    return "The Google sign-in window was closed before finishing.";
  }
  return "We could not sign you in. Please try again.";
};

export default function LoginPage({ user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || "/dashboard";

  useEffect(() => {
    if (user) navigate(destination, { replace: true });
  }, [destination, navigate, user]);

  const signInWithEmail = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(destination, { replace: true });
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  const signInWithGoogle = async () => {
    setSubmitting(true);
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate(destination, { replace: true });
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-page__brand">
        <Brand />
        <Link className="text-link" to="/">
          Back home
        </Link>
      </div>

      <section className="auth-card">
        <div className="auth-card__aside">
          <p className="eyebrow">おかえりなさい</p>
          <h1>Welcome back.</h1>
          <p>
            Your notes are waiting. Sign in and continue from the last page.
          </p>
          <blockquote>“A little every day becomes a lifetime.”</blockquote>
        </div>

        <div className="auth-card__form">
          <p className="eyebrow">Member sign in</p>
          <h2>Open your notebook</h2>
          <form onSubmit={signInWithEmail}>
            <label>
              Email address
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                required
                type="password"
                value={password}
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button
              className="button button--ink button--full"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Opening…" : "Sign in"}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            className="button button--paper button--full"
            disabled={submitting}
            onClick={signInWithGoogle}
            type="button"
          >
            <span className="google-mark">G</span>
            Continue with Google
          </button>
        </div>
      </section>
    </main>
  );
}
