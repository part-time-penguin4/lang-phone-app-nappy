import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import useSession from "../store/useSession";
import useDeck from "../store/useDeck";
import { hasAnyReminder } from "../lib/notifications";

export default function HomeScreen({ navigation }) {
  const session = useSession();
  const deck = useDeck();
  const [reminderOn, setReminderOn] = useState(false);

  useEffect(() => {
    (async () => {
      // session ilerlemesini cihazdan al
      await session.hydrate?.();

      // deck hazır değilse yükle
      if (!deck.ready) {
        await deck.hydrate();
      }
      if (!deck.deck) {
        await deck.load("a1-core"); // kendi deck id’in neyse
      }

      // bildirim durumu
      setReminderOn(await hasAnyReminder());
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ana ekrana hoş geldiniz! ✨</Text>

      <Text style={styles.sub}>
        Günlük hedef: {session.goalPerDay} XP • Streak: {session.streak}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Review")}
        >
          <Text style={styles.btntxt}>Tekrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Learn")}
        >
          <Text style={styles.btntxt}>Öğren</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.rem, reminderOn && styles.remOn]}
        onPress={async () => {
          const on = await hasAnyReminder();
          setReminderOn(on);
        }}
      >
        <Text style={styles.remTxt}>
          {reminderOn ? "Hatırlatma açık" : "Hatırlatma kapalı"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  sub: { color: "#444", marginBottom: 16 },
  row: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: { flex: 1, backgroundColor: "#111", paddingVertical: 12, borderRadius: 12 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "700" },
  rem: { marginTop: 24, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ccc" },
  remOn: { backgroundColor: "#f3f4f6" },
  remTxt: { fontWeight: "600" },
});
