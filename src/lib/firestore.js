import { getFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebaseConfig";

const db = getFirestore();

export async function upsertReviewFS(state) {
  const u = auth.currentUser;
  if (!u) return;
  const ref = doc(db, "users", u.uid, "reviews", state.cardId);
  await setDoc(ref, { ...state, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getAllReviewsFS() {
  const u = auth.currentUser;
  if (!u) return {};
  const snap = await getDocs(collection(db, "users", u.uid, "reviews"));
  const cloud = {};
  snap.forEach(d => cloud[d.id] = d.data());
  return cloud;
}
