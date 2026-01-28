import { View, Text, Image, TouchableOpacity, Button, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import api from "../src/services/api";

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
};

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    api.get("/dashboard").then(res => setVideos(res.data));
  }, []);

  return (
    <View style={styles.container}>

      {/* SETTINGS BUTTON */}
      <View style={styles.settings}>
        <Button title="Settings" onPress={() => router.push("/settings")} />
      </View>

      {/* VIDEO TILES */}
      {videos.map(v => (
        <TouchableOpacity
          key={v.id}
          onPress={() => router.push(`/video/${v.id}`)}
          style={styles.card}
        >
          <Image
            source={{ uri: v.thumbnail_url }}
            style={styles.thumbnail}
          />

          <Text style={styles.title}>{v.title}</Text>

          {/*  SHORT DESCRIPTION  */}
          <Text style={styles.description}>
            {v.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  settings: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  card: {
    marginBottom: 24,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});