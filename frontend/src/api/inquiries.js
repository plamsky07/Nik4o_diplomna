// src/api/inquiries.js
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";

// ✅ само логнат потребител може да праща
export async function createInquiry(payload) {
  if (!auth.currentUser) throw new Error("NOT_LOGGED_IN");

  const docRef = await addDoc(collection(db, "inquiries"), {
    ...payload,
    userId: auth.currentUser.uid,
    status: "new",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getNewInquiriesCount() {
  const q = query(collection(db, "inquiries"), where("status", "==", "new"));
  const snap = await getDocs(q);
  return snap.size;
}

// ✅ live слушател за нови запитвания (за админ нотификации)
export function listenForNewInquiries(cb) {
  const q = query(collection(db, "inquiries"), where("status", "==", "new"));

  const unsub = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(items);
  });

  return unsub;
}

export async function getAllInquiries() {
  const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    const status = data.status ?? (data.isNew ? "new" : "read");

    return {
      id: d.id,
      ...data,
      status,
      isNew: status === "new",
      isRead: status === "read",
    };
  });
}

export async function markInquiryRead(id) {
  await updateDoc(doc(db, "inquiries", id), {
    status: "read",
    isNew: false,
    isRead: true,
  });
}

export async function markInquiryNew(id) {
  await updateDoc(doc(db, "inquiries", id), {
    status: "new",
    isNew: true,
    isRead: false,
  });
}

export async function deleteInquiry(id) {
  await deleteDoc(doc(db, "inquiries", id));
}
