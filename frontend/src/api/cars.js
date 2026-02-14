// src/api/cars.js
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getCars() {
  const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getCarById(id) {
  const snap = await getDoc(doc(db, "cars", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createCar(payload) {
  const docRef = await addDoc(collection(db, "cars"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateCar(id, payload) {
  await updateDoc(doc(db, "cars", id), payload);
}

export async function deleteCar(id) {
  await deleteDoc(doc(db, "cars", id));
}
