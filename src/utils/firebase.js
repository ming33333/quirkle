import { getApps, initializeApp } from "firebase/app";
import { landingExperimentParams } from "./landingExperiment";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics = null;
const analyticsReady =
  typeof window === "undefined" || !firebaseConfig.measurementId
    ? Promise.resolve(null)
    : isSupported()
        .then((supported) => {
          if (!supported) return null;
          analytics = getAnalytics(app);
          return analytics;
        })
        .catch(() => null);

const LANDING_KEY = "quirkle.landing";
const SESSION_MS = 30 * 60 * 1000;

function currentPath() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.pathname}${window.location.search}`;
}

/** First page of this visit. Later events keep it so GA can compare landing pages. */
export function landingPage(path) {
  const next = path || currentPath();
  if (typeof sessionStorage === "undefined") return next;
  const now = Date.now();
  try {
    const saved = JSON.parse(sessionStorage.getItem(LANDING_KEY) || "null");
    if (saved?.path && now - saved.at < SESSION_MS) {
      sessionStorage.setItem(
        LANDING_KEY,
        JSON.stringify({ path: saved.path, at: now }),
      );
      return String(saved.path).slice(0, 100);
    }
    if (!next) return undefined;
    const pathValue = String(next).slice(0, 100);
    sessionStorage.setItem(
      LANDING_KEY,
      JSON.stringify({ path: pathValue, at: now }),
    );
    return pathValue;
  } catch {
    return next ? String(next).slice(0, 100) : next;
  }
}

export function getFirebaseAnalytics() {
  return analytics;
}

export async function logAnalyticsEvent(eventName, params = {}) {
  const instance = analytics || (await analyticsReady);
  if (!instance) return;
  logEvent(instance, eventName, {
    landing_page: landingPage(),
    ...landingExperimentParams(),
    ...params,
  });
}

export function logPageView(path) {
  const page = path || currentPath();
  void logAnalyticsEvent("page_view", {
    page_path: page,
    page_title: typeof document !== "undefined" ? document.title : undefined,
    page_location:
      typeof window !== "undefined" ? window.location.href : undefined,
    landing_page: landingPage(page),
  });
}
