import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isAdmin } from "../utils/admins";

const STORAGE_KEY = "quirkle.impersonateEmail";

const ImpersonationContext = createContext({
  impersonatedEmail: null,
  startImpersonation: async () => {},
  stopImpersonation: () => {},
  effectiveUser: null,
});

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function ImpersonationProvider({ user, children }) {
  const [impersonatedEmail, setImpersonatedEmail] = useState(() => {
    try {
      return normalizeEmail(sessionStorage.getItem(STORAGE_KEY) || "") || null;
    } catch {
      return null;
    }
  });

  const stopImpersonation = useCallback(() => {
    setImpersonatedEmail(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const startImpersonation = useCallback(
    async (email) => {
      const normalized = normalizeEmail(email);
      if (!isValidEmail(normalized)) {
        throw new Error("Enter a valid email address.");
      }
      if (!user?.email) {
        throw new Error("You must be signed in.");
      }
      const allowed = await isAdmin(user.email);
      if (!allowed) {
        throw new Error("Only admins can view as another user.");
      }
      if (normalized === normalizeEmail(user.email)) {
        throw new Error("That is already your account.");
      }

      setImpersonatedEmail(normalized);
      try {
        sessionStorage.setItem(STORAGE_KEY, normalized);
      } catch {
        /* ignore */
      }
      return normalized;
    },
    [user],
  );

  useEffect(() => {
    if (!user) {
      stopImpersonation();
      return;
    }
    if (!impersonatedEmail) return;

    let cancelled = false;
    isAdmin(user.email).then((allowed) => {
      if (!cancelled && !allowed) stopImpersonation();
    });
    return () => {
      cancelled = true;
    };
  }, [user, impersonatedEmail, stopImpersonation]);

  const effectiveUser = useMemo(() => {
    if (!user) return null;
    if (!impersonatedEmail) return user;
    return {
      ...user,
      email: impersonatedEmail,
      displayName: impersonatedEmail.split("@")[0],
      isImpersonating: true,
      realEmail: user.email,
    };
  }, [user, impersonatedEmail]);

  const value = useMemo(
    () => ({
      impersonatedEmail,
      startImpersonation,
      stopImpersonation,
      effectiveUser,
    }),
    [impersonatedEmail, startImpersonation, stopImpersonation, effectiveUser],
  );

  return (
    <ImpersonationContext.Provider value={value}>
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation() {
  return useContext(ImpersonationContext);
}
