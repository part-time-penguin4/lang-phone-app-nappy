import a1Core from "../data/a1-core.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReviewState, scheduleNext } from "../lib/srs";
import { create } from "zustand";
import { upsertReviewFS, getAllReviewsFS } from "../lib/firestore";
import { auth } from "../firebaseConfig";

const STORAGE_KEY = "reviews";

  const useDeck = create((set, get) => ({
  deck: null,
  reviews: {},          // { [cardId]: ReviewState }
  ready: false,

  async hydrate() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const reviews = raw ? JSON.parse(raw) : {};
    set({ reviews });
    // Bulut senkronizasyonu
    try  {
      const u = auth.currentUser;
      if (u) {
        const cloud = await getAllReviewsFS();
        const merged = { ...reviews };
        for (const [id, r] of Object.entries(cloud)) {
          const localTime = merged[id]?.updatedAt || 0;
          const cloudTime = r.updatedAt?.toMillis?.() || 0;
          if (!merged[id] || cloudTime > localTime) merged[id] = { ...r, updatedAt: cloudTime };
        }
        set({ reviews: merged });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        console.log("Firestore merge completed ✅");
      }
    } catch (e) {
      console.log("FS sync error:", e.code || e.message);
    }
  },

  async load(deckId) {
    let cards = [];

    if (deckId === "a1-core") {
    cards = a1Core.cards || [];
    } else {
    // ileride farklı deck'ler eklediğimizde buraya if ekleyeceğiz
    cards = [];
    }

    set({
    deck: {
      id: deckId,
      cards,
      },
    });

  console.log("Deck loaded:", deckId, "cards:", cards.length);
},


    getDueCards() {
    const { deck, reviews } = get();

    // deck henüz yüklenmemişse boş dizi dön
    if (!deck || !Array.isArray(deck.cards)) {
      return [];
    }

    const now = Date.now();
    return deck.cards.filter(card => {
      const r = reviews[card.id];
      return !r || (r.due && r.due <= now);
    });
  },

   pickSession(size = 10) {
    const { deck } = get();
    const due = get().getDueCards();

    // yine güvenlik: deck yoksa boş dizi
    if (!deck || !Array.isArray(deck.cards)) {
      console.log("pickSession: deck not loaded yet");
      return [];
    }

    const pool = due.length ? due : deck.cards;
    return pool.slice(0, size);
  },


  async submit(cardId, quality) {
    const { reviews } = get();
    const next = scheduleNext(reviews[cardId] ?? initReviewState(cardId), quality);
    const merged = { ...reviews, [cardId]: next };
    set({ reviews: merged });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    try { await upsertReviewFS(next); } catch (e) { console.log("Firestore write fail:", e.code || e.message); }
    return next;
  },
}));
export default useDeck;
export { useDeck};

