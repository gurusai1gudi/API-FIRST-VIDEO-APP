import { View, TextInput, Button, Text } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import api from "../src/services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    await api.post("/auth/signup", {
      name,
      email,
      password,
    });
    router.replace("/login");
  };

  return (
    <View>
      <Text>Signup</Text>
      <TextInput placeholder="Name" onChangeText={setName} />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Create Account" onPress={signup} />
    </View>
  );
}