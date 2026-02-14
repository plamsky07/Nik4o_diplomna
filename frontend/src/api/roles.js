import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function isUserAdmin(uid) {
  try {
    const snap = await getDoc(doc(db, "roles", uid));
    return snap.exists() && snap.data()?.role === "admin";
  } catch (e) {
    console.error("Грешка при проверка за админ:", e);
    return false;
  }
}
