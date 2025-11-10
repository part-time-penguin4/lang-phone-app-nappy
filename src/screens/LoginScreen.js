import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Başarılı → Home'a geç (stack’te Login’i kaldırmak için replace)
      navigation.replace("Home");
    } catch (e) {
      Alert.alert("Giriş yapılamadı", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? "Bekleyin..." : "Giriş Yap"} onPress={onLogin} disabled={loading} />
      <Text style={{ marginTop: 12 }}>
        Hesabın yok mu?{" "}
        <Text style={{ color: "#0a84ff" }} onPress={() => navigation.navigate("Register")}>
          Kayıt Ol
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 },
});
const onLogin = async () => {
  try {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email.trim(), password);
    navigation.replace("Home");
  } catch (e) {
    // 🔎 Hata kodunu ve mesajı NET gör
    console.log("AUTH ERROR:", e.code, e.message);
    // İstersen ekranda da göster:
    Alert.alert("Giriş hatası", `${e.code}\n${e.message}`);
  } finally {
    setLoading(false);
  }
};
