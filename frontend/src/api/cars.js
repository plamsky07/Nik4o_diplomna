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
import { demoCars } from "../data/demoCars";
import { sanitizeCarImageUrl } from "../utils/carImages";

function normalizeDate(value) {
  if (!value) return 0;
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function mergeCars(liveCars) {
  const byId = new Map();
  [...demoCars, ...liveCars].forEach((car) => {
    byId.set(car.id, normalizeCarImages(car));
  });

  return Array.from(byId.values()).sort((a, b) => normalizeDate(b.createdAt) - normalizeDate(a.createdAt));
}

function normalizeCarImages(car) {
  const images = Array.isArray(car.images)
    ? car.images.map(sanitizeCarImageUrl).filter(Boolean)
    : [];
  const fallbackImage = sanitizeCarImageUrl(car.imageUrl);
  const fallback = fallbackImage ? [fallbackImage] : [];
  const finalImages = images.length ? images : fallback;

  return {
    ...car,
    images: finalImages,
    imageUrl: finalImages[0] || "",
  };
}

export async function getCars() {
  const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return mergeCars(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getCarById(id) {
  const demo = demoCars.find((car) => car.id === id);
  if (demo) return normalizeCarImages(demo);

  const snap = await getDoc(doc(db, "cars", id));
  if (!snap.exists()) return null;
  return normalizeCarImages({ id: snap.id, ...snap.data() });
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
