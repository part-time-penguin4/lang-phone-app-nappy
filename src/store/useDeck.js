import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReviewState, scheduleNext, Qualities } from "../lib/srs";
import { loadDeck } from "../lib/contentLoader";

const STORAGE_KEY = "reviews";

export const useDeck = create((set, get) => ({
  deck: null,
  reviews: {},          // { [cardId]: ReviewState }
  ready: false,

  async hydrate() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const reviews = raw ? JSON.parse(raw) : {};
    set({ reviews });
  },

  async load(deckId = "a1-core") {
    const deck = await loadDeck(deckId);
    set({ deck, ready: true });
    if (!Object.keys(get().reviews).length) {
      // Yeni kullanıcı için başlangıç durumlarını hazırla
      const reviews = {};
      for (const card of deck.cards) reviews[card.id] = initReviewState(card.id);
      set({ reviews });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().reviews));
    }
  },

  getDueCards() {
    const { deck, reviews } = get();
    if (!deck) return [];
    const now = Date.now();
    return deck.cards.filter((c) => (reviews[c.id]?.due ?? 0) <= now);
  },

  pickSession(size = 10) {
    const { deck } = get();
    const due = get().getDueCards();
    const pool = due.length ? due : deck.cards;
    // basitçe ilk N taneyi al
    return pool.slice(0, size);
  },

  async submit(cardId, quality) {
    const { reviews } = get();
    const next = scheduleNext(reviews[cardId] ?? initReviewState(cardId), quality);
    const merged = { ...reviews, [cardId]: next };
    set({ reviews: merged });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return next;
  },
}));

export { Qualities };
