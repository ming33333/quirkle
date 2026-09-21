import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Brand from "../components/Brand.jsx";
import { auth } from "../utils/firebase";

const ANIMAL_FACTS = [
  "Octopuses have three hearts.",
  "A group of flamingos is called a flamboyance.",
  "Sea otters hold hands while they sleep.",
  "Cows have best friends and get stressed when separated.",
  "A snail can sleep for three years.",
  "Honey never spoils — 3,000-year-old honey is still edible.",
  "Wombat poop is cube-shaped.",
  "Axolotls can regrow lost limbs.",
  "Butterflies taste with their feet.",
  "Elephants are the only mammals that can’t jump.",
  "A shrimp’s heart is in its head.",
  "Sloths can hold their breath longer than dolphins.",
  "Starfish don’t have brains.",
  "Koala fingerprints look almost human.",
  "Penguins propose with a pebble.",
  "Giraffes have the same number of neck bones as you.",
  "Some turtles breathe through their rear end.",
  "Hummingbirds are the only birds that fly backwards.",
  "Platypuses glow under UV light.",
  "Cats can’t taste sweetness.",
];

const readableAuthError = (error) => {
  const code = error?.code || "";
  if (code.includes("popup-closed")) {
    return "The Google sign-in window was closed before finishing.";
  }
  return "We could not sign you in. Please try again.";
};

function GoogleMark() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.26-2.08 3.55-5.15 3.55-8.65Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3c-1.08.72-2.47 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.3A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.3V6.61H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.99-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.36.61 4.61 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function LoginVisual() {
  const svgRef = useRef(null);
  const eyeRef = useRef(null);
  const [factIndex, setFactIndex] = useState(0);
  const [talking, setTalking] = useState(false);
  const [pupil, setPupil] = useState({ x: -5, y: -54 });

  const showFact = () => {
    setTalking(true);
  };

  const hideFact = () => {
    setTalking(false);
    setFactIndex((current) => (current + 1) % ANIMAL_FACTS.length);
  };

  const trackEye = (event) => {
    const eye = eyeRef.current;
    const svg = svgRef.current;
    if (!eye || !svg) return;

    const ctm = eye.getScreenCTM();
    if (!ctm) return;

    const cursor = svg.createSVGPoint();
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    const local = cursor.matrixTransform(ctm.inverse());
    const dx = local.x - -6;
    const dy = local.y - -54;
    const length = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1.15, length / 18);

    setPupil({
      x: -6 + (dx / length) * reach,
      y: -54 + (dy / length) * reach,
    });
  };

  return (
    <div className="login-visual" onMouseMove={trackEye} onMouseLeave={() => setPupil({ x: -5, y: -54 })}>
      <div className="login-visual__stage">
        <div className={`login-speech${talking ? " is-on" : ""}`} role="status">
          {ANIMAL_FACTS[factIndex]}
        </div>
        <svg
          ref={svgRef}
          className="drinking-bird"
          viewBox="0 0 240 260"
          aria-hidden="true"
        >
        <line x1="24" y1="232" x2="216" y2="232" stroke="#2f373b" strokeWidth="3" />

        <path
          d="M32 232 V164 C32 156 40 152 48 152 H84 C92 152 100 156 100 164 V232"
          fill="#fffcf5"
          stroke="#2f373b"
          strokeWidth="2"
        />
        <path d="M36 188 H96 V228 H36 Z" fill="#c5d4d8" opacity="0.7" />
        <ellipse className="drinking-bird__ripple" cx="66" cy="188" rx="22" ry="3" fill="none" stroke="#2f373b" strokeWidth="1.2" />

        <path d="M118 232 L132 122 L146 232" fill="none" stroke="#2f373b" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="132" cy="122" r="6" fill="#e9e0d1" stroke="#2f373b" strokeWidth="2" />

        <g transform="translate(132 122)">
          <g
            className="drinking-bird__hit"
            onMouseEnter={showFact}
            onMouseLeave={hideFact}
          >
            <g className="drinking-bird__body">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;0;-72;-72;0;0"
                keyTimes="0;0.18;0.48;0.58;0.82;1"
                dur="7.5s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              />
              <ellipse cx="0" cy="4" rx="42" ry="88" fill="transparent" />
              <line x1="0" y1="-38" x2="0" y2="44" stroke="#2f373b" strokeWidth="4" />
              <ellipse cx="0" cy="62" rx="20" ry="22" fill="#c64b38" stroke="#2f373b" strokeWidth="2" />
              <ellipse cx="0" cy="58" rx="12" ry="10" fill="#9e3c2d" />
              <circle cx="0" cy="-52" r="16" fill="#263d4a" stroke="#2f373b" strokeWidth="2" />
              <circle ref={eyeRef} cx="-6" cy="-54" r="3.2" fill="#fffcf5" />
              <circle cx={pupil.x} cy={pupil.y} r="1.45" fill="#2f373b" />
              <path d="M-14 -50 L-50 -44 L-50 -58 Z" fill="#e9e0d1" stroke="#2f373b" strokeWidth="1.6" strokeLinejoin="round" />
              <rect x="-12" y="-74" width="24" height="12" fill="#c64b38" stroke="#2f373b" strokeWidth="1.6" />
              <ellipse cx="0" cy="-74" rx="12" ry="4" fill="#c64b38" stroke="#2f373b" strokeWidth="1.6" />
            </g>
          </g>
        </g>
      </svg>
      </div>
    </div>
  );
}

export default function LoginPage({ user }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || "/dashboard";
  const keepingSample = destination === "/try";

  useEffect(() => {
    if (user) navigate(destination, { replace: true });
  }, [destination, navigate, user]);

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
    <main className="login-split">
      <LoginVisual />

      <section className="login-panel">
        <Brand />
        <h1>{keepingSample ? "Keep this notebook" : "Sign in"}</h1>
        <p>
          {keepingSample
            ? "Continue with Google to save Curious creatures to your account."
            : "Continue with Google to open your notebook."}
        </p>
        {error && <p className="form-error">{error}</p>}
        <button
          className="button button--ink button--full"
          disabled={submitting}
          onClick={signInWithGoogle}
          type="button"
        >
          <GoogleMark />
          {submitting ? "Opening…" : "Sign in with Google"}
        </button>
        <Link className="text-link" to="/">
          Back home
        </Link>
      </section>
    </main>
  );
}
