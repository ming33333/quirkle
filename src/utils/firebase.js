import { getApps, initializeApp } from "firebase/app";
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

export function getFirebaseAnalytics() {
  return analytics;
}

export async function logAnalyticsEvent(eventName, params) {
  const instance = analytics || (await analyticsReady);
  if (!instance) return;
  logEvent(instance, eventName, params);
}

export function logPageView(path) {
  void logAnalyticsEvent("page_view", {
    page_path: path,
    page_title: typeof document !== "undefined" ? document.title : undefined,
    page_location:
      typeof window !== "undefined" ? window.location.href : undefined,
  });
}
