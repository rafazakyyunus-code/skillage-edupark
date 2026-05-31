// attractionsService.js
import { db } from "../../firebase";
import {
  ref, push, set, get, update, remove, onValue, off,
} from "firebase/database";

const ATTRACTIONS_REF = "attractions";

/* ─── HELPER: normalize snapshot to array ─────────────────────────── */
function snapshotToArray(snapshot) {
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([key, val]) => ({
    ...val,
    firebaseKey: key,
  }));
}

/* ─── GET ALL ──────────────────────────────────────────────────────── */
export async function getAllAttractions() {
  const snapshot = await get(ref(db, ATTRACTIONS_REF));
  return snapshotToArray(snapshot);
}

/* ─── SUBSCRIBE (real-time) ────────────────────────────────────────── */
export function subscribeAttractions(callback) {
  const attractionsRef = ref(db, ATTRACTIONS_REF);

  const listener = onValue(
    attractionsRef,
    (snapshot) => {
      callback(snapshotToArray(snapshot));
    },
    (error) => {
      console.error("Firebase attractions error:", error.message);
      callback([]);
    }
  );

  return () => off(attractionsRef, "value", listener);
}

/* ─── GET ONE BY ID ────────────────────────────────────────────────── */
export async function getAttractionById(id) {
  const all = await getAllAttractions();
  // Coba cocokkan dengan field `id` (numeric/string) atau firebaseKey
  return (
    all.find((item) => String(item.id) === String(id)) ||
    all.find((item) => item.firebaseKey === String(id)) ||
    null
  );
}

/* ─── CREATE ───────────────────────────────────────────────────────── */
export async function createAttraction(data) {
  const attractionsRef = ref(db, ATTRACTIONS_REF);
  const newRef = push(attractionsRef);
  const payload = {
    ...data,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await set(newRef, payload);
  return { firebaseKey: newRef.key, ...payload };
}

/* ─── UPDATE ───────────────────────────────────────────────────────── */
export async function updateAttraction(firebaseKey, data) {
  const attractionRef = ref(db, `${ATTRACTIONS_REF}/${firebaseKey}`);
  const updates = { ...data, updatedAt: new Date().toISOString() };
  await update(attractionRef, updates);
  return updates;
}

/* ─── DELETE ───────────────────────────────────────────────────────── */
export async function deleteAttraction(firebaseKey) {
  await remove(ref(db, `${ATTRACTIONS_REF}/${firebaseKey}`));
}