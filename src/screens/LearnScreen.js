import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import { useDeck, Qualities } from "../store/useDeck";
import { useSession } from "../store/useSession";

export default function LearnScreen() {
  const deckStore = useDeck();
  const session = useSession();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    (async () => {
      if (!deckStore.ready) await deckStore.hydrate();
      if (!deckStore.deck) await deckStore.load("a1-core");
      if (!session.lastActiveDay) await session.hydrate();
    })();
  }, []);

  const cards = session.inSession ? session.currentSet : deckStore.pickSession(10);
  const index = session.currentIndex;
  const card = cards[index];

  useEffect(() => {
    if (!session.inSession && cards.length) session.startSession(cards);
  }, [deckStore.ready, deckStore.deck]);

  if (!card) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Seans bitti 🎉</Text>
        <TouchableOpacity style={styles.cta} onPress={() => session.endSession()}>
          <Text style={styles.ctaText}>Ana sayfaya dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onQuality = async (q) => {
    await deckStore.submit(card.id, q);
    await session.submitAnswer({ quality: q });
    setRevealed(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{index + 1} / {cards.length}</Text>

      <View style={styles.card}>
        <Text style={styles.front}>{card.front}</Text>

        {revealed ? <Text style={styles.back}>{card.back}</Text> : null}

        <View style={styles.row}>
          <TouchableOpacity style={styles.small} onPress={() => Speech.speak(card.back ?? card.front)}>
            <Text>🔊 Dinle</Text>
          </TouchableOpacity>
          {!revealed && (
            <TouchableOpacity style={styles.small} onPress={() => setRevealed(true)}>
              <Text>Göster</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.grid}>
        <QualityButton label="Again" onPress={() => onQuality(Qualities.AGAIN)} />
        <QualityButton label="Hard"  onPress={() => onQuality(Qualities.HARD)} />
        <QualityButton label="Good"  onPress={() => onQuality(Qualities.GOOD)} />
        <QualityButton label="Easy"  onPress={() => onQuality(Qualities.EASY)} />
      </View>
    </View>
  );
}

function QualityButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.qbtn} onPress={onPress}>
      <Text style={styles.qtxt}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  cta: { padding: 12, backgroundColor: "#111", borderRadius: 10 },
  ctaText: { color: "#fff", fontWeight: "600" },

  progress: { textAlign: "center", fontWeight: "600", color: "#444" },
  card: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#eee", gap: 10 },
  front: { fontSize: 28, fontWeight: "800", textAlign: "center" },
  back: { fontSize: 22, textAlign: "center", color: "#333" },
  row: { flexDirection: "row", justifyContent: "center", gap: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "space-between" },
  qbtn: { flexBasis: "48%", padding: 14, backgroundColor: "#f4f4f5", borderRadius: 12, alignItems: "center" },
  qtxt: { fontWeight: "700" },
});
