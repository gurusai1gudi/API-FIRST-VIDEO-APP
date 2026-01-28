import { View, Text, Button } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "../src/services/api";

type User = {
  name: string;
  email: string;
};

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.get("/auth/me").then(res => {
      setUser(res.data);
    });
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Settings</Text>

      {user && (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
        </>
      )}

      <Button title="Logout" onPress={logout} />
    </View>
  );
}