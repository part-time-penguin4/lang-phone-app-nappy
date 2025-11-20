// app.config.js
export default {
  expo: {
    name: "project-nappy",
    slug: "project-nappy",
    scheme: "projectnappy",             // derin link (isteğe bağlı)
    orientation: "portrait",
    platforms: ["ios", "android", "web"],

    extra: {
      API_ENV: "dev",                   // örnek env
      // EXPO_PUBLIC_* ile başlayanları uygulama içinde process.env ile okuyabilirsin
      EXPO_PUBLIC_BUILD_TAG: "local"
    },

    // Android paket kimliği 
    android: {
      package: "com.noir.projectnappy",
      permissions: [
        "INTERNET",
        "RECORD_AUDIO"                  // mikrofon 
      ]
    },

    // iOS bundle id + izin açıklaması
    ios: {
      bundleIdentifier: "com.yourname.projectnappy",
      infoPlist: {
        NSMicrophoneUsageDescription: "Telaffuz alıştırmaları için mikrofon kullanılır."
      }
    },

    // Bildirimler için plugin (şimdilik yerel bildirim yeterli)
    plugins: ["expo-notifications"],
  android: {
  package: "com.yourname.projectnappy",
  // bildirim kanalı için simge istersen daha sonra ekleriz
          },
  ios: {
  bundleIdentifier: "com.yourname.projectnappy",
  }

}
};
