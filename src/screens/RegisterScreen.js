import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert("Başarılı!", "Kullanıcı başarıyla oluşturuldu.");
        navigation.navigate('Login'); // Kayıttan sonra giriş ekranına yönlendir
      })
      .catch((error) => {
        Alert.alert("Kayıt Hatası", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Kayıt Ol" onPress={handleRegister} />
      <Button title="Zaten hesabın var mı? Giriş Yap" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

// Stil kodları aynı kalabilir...
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 },
});

export default RegisterScreen;
const onRegister = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
    navigation.replace("Home");
  } catch (e) {
    console.log("REGISTER ERROR:", e.code, e.message);
    Alert.alert("Kayıt hatası", `${e.code}\n${e.message}`);
  }
};
