import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isAdmin = async (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  try {
    const snapshot = await getDoc(doc(db, "admins", normalized));
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export const listAdmins = async () => {
  const snapshot = await getDocs(collection(db, "admins"));
  return snapshot.docs
    .map((adminDoc) => ({
      id: adminDoc.id,
      email: adminDoc.id,
      ...adminDoc.data(),
    }))
    .sort((a, b) => a.email.localeCompare(b.email));
};

export const addAdmin = async (email) => {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  const adminRef = doc(db, "admins", normalized);
  const existing = await getDoc(adminRef);
  if (existing.exists()) {
    throw new Error("That email is already an admin.");
  }

  await setDoc(adminRef, {
    email: normalized,
    addedAt: new Date().toISOString(),
  });

  return normalized;
};

export const removeAdmin = async (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    throw new Error("Missing admin email.");
  }

  const admins = await listAdmins();
  if (admins.length <= 1) {
    throw new Error("At least one admin must remain.");
  }

  await deleteDoc(doc(db, "admins", normalized));
  return normalized;
};
