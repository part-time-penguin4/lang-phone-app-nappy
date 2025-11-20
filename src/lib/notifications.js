// src/lib/notifications.js
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function ensureNotiPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    return req.status === "granted";
  }
  return true;
}

export async function setupAndroidChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily", {
      name: "Daily Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function scheduleDailyReminder(hour = 20, minute = 0) {
  const ok = await ensureNotiPermission();
  if (!ok) return null;
  await setupAndroidChannel();

  // önce eski günlükleri temizle
  await cancelAllReminders();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Günün alıştırması hazır!",
      body: "10 dakikanı ayır, ilerlemeyi sürdür ✨",
      sound: true,
    },
    trigger: { hour, minute, repeats: true, channelId: "daily" },
  });
  return id;
}

export async function cancelAllReminders() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(all.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

export async function hasAnyReminder() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.length > 0;
}

