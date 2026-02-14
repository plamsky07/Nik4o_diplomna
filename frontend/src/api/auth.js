import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

export function listenAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

export async function register(email, password, username = "") {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (username.trim()) {
    await updateProfile(cred.user, { displayName: username.trim() });
  }
  await sendEmailVerification(cred.user);
  return cred.user;
}

export async function resendVerification() {
  if (!auth.currentUser) throw new Error("Няма активен потребител.");
  await sendEmailVerification(auth.currentUser);
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function logout() {
  await signOut(auth);
}

export async function updateCurrentUserProfile({ username }) {
  if (!auth.currentUser) throw new Error("NOT_LOGGED_IN");
  await updateProfile(auth.currentUser, {
    displayName: (username ?? "").trim(),
  });
  return auth.currentUser;
}

export async function registerWithEmail(email, password, username = "") {
  return register(email, password, username);
}
