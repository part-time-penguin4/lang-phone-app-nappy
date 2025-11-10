import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSession } from "../store/useSession";

export default function HomeScreen({ navigation }) {
  const session = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ana ekrana hoş geldiniz! 👋</Text>

      <Text style={styles.sub}>
        Günlük hedef: {session.goalPerDay} XP • Streak: {session.streak}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Review")}>
          <Text style={styles.btntxt}>Tekrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Learn")}>
          <Text style={styles.btntxt}>Öğren</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  sub: { color: "#444", marginTop: 4, marginBottom: 16 },
  row: { flexDirection: "row", gap: 12 },
  btn: { backgroundColor: "#111", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  btntxt: { color: "#fff", fontWeight: "700" },
});
