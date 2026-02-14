import { db, auth } from "./firebase";
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function addFavorite(carId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Трябва да сте влезли.");
  await setDoc(doc(db, "users", uid, "favorites", carId), {
    carId,
    createdAt: serverTimestamp(),
  });
}

export async function removeFavorite(carId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Трябва да сте влезли.");
  await deleteDoc(doc(db, "users", uid, "favorites", carId));
}

export async function isFavorite(carId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return false;
  const snap = await getDoc(doc(db, "users", uid, "favorites", carId));
  return snap.exists();
}
