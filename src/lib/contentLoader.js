import { Platform } from "react-native";

// Basit senaryo: yerel JSON'dan kurs içeriğini okuyoruz.
export async function loadDeck(deckId = "a1-core") {
  // Metro bundler ile yerel JSON importu:
  const data = await import("../data/a1-core.json");
  const cards = data.default || data;
  return {
    id: deckId,
    title: "A1 Core",
    cards: cards.map((c, idx) => ({
      id: c.id ?? `${deckId}-${idx}`,
      deckId,
      front: c.front,
      back: c.back,
      hint: c.hint,
      audioUrl: c.audioUrl,
    })),
  };
}
// Alternatif: Yerel dosya sistemi (yalnızca React Native)