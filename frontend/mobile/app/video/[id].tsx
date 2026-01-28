import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Video() {
  const { id } = useLocalSearchParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  if (!token) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      source={{
        uri: `http://192.168.1.4:5000/video/${id}/stream`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }}
      style={{ flex: 1 }}
      javaScriptEnabled
      domStorageEnabled
      allowsFullscreenVideo
      mediaPlaybackRequiresUserAction={false}
      originWhitelist={["*"]}
      scalesPageToFit
    />
  );
}