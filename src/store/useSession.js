import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "session-progress";

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

const useSession = create((set, get) => ({
  goalPerDay: 30,
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  inSession: false,
  currentIndex: 0,
  currentSet: [],

  async hydrate() {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (raw) set(JSON.parse(raw));
  },

  async persist() {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(get()));
  },

  startSession(cards) {
    set({ inSession: true, currentIndex: 0, currentSet: cards });
  },

  async submitAnswer({ quality }) {
    const xpGain =
      quality === "easy" ? 5 :
      quality === "good" ? 4 :
      quality === "hard" ? 3 : 1;

    const nextXp = get().xp + xpGain;

    const tKey = todayKey();
    const prevDay = get().lastActiveDay;
    let streak = get().streak || 0;

    if (!prevDay || prevDay !== tKey) {
      streak = prevDay ? streak + 1 : 1;
    }

    set({ xp: nextXp, streak, lastActiveDay: tKey });
    await get().persist();
  },

  endSession() {
    set({ inSession: false, currentIndex: 0, currentSet: [] });
  },
}));

export default useSession;
