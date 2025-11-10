import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDeck } from "../store/useDeck";
import { useSession } from "../store/useSession";

export default function ReviewScreen({ navigation }) {
  const deck = useDeck();
  const session = useSession();

  useEffect(() => {
    (async () => {
      if (!deck.ready) await deck.hydrate();
      if (!deck.deck) await deck.load("a1-core");
      if (!session.lastActiveDay) await session.hydrate();
    })();
  }, []);

  const due = deck.getDueCards();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vadesi gelen kartlar</Text>
      <Text style={styles.count}>{due.length}</Text>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.navigate("Learn")}
        disabled={due.length === 0}
      >
        <Text style={styles.ctaText}>{due.length ? "Başla" : "Bugünlük bitti"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  count: { fontSize: 48, fontWeight: "900" },
  cta: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: "#111", borderRadius: 12 },
  ctaText: { color: "#fff", fontWeight: "700" },
});
