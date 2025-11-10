// src/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqAPj1vvtXv34QBGK38_0VsYh2EG1fWaw",
  authDomain: "project-nappy.firebaseapp.com",
  projectId: "project-nappy",
  storageBucket: "project-nappy.firebasestorage.app",
  messagingSenderId: "654760484005",
  appId: "1:654760484005:web:ae5adfc9121a69d6ce014c"
};
// Uygulamayı tekil başlat (hot-reload tekrarı engelle)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// RN'de kalıcı oturum:
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});