import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useDeck from "../store/useDeck";

export default function ReviewScreen() {
  const deck = useDeck();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const sessionCards = deck.pickSession ? deck.pickSession(5) : [];
    setCards(sessionCards);
  }, [deck.deck]); // deck değişince yeniden seç

  if (!cards.length) {
    return (
      <View style={styles.center}>
        <Text>Şu an gösterilecek kart yok.</Text>
      </View>
    );
  }

  const first = cards[0];

  return (
    <View style={styles.center}>
      <Text style={styles.front}>{first.front}</Text>
      <Text style={styles.back}>{first.back}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  front: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  back: { fontSize: 20, color: "#444" },
});
