import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const User = ({ item }) => {
  const navigation = useNavigation();
  return (
    <View style={{ padding: 10, marginTop: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable>
          <Image
            source={{ uri: item?.image }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text>{item?.username}</Text>
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate("Request", {
              name: item?.username,
              receiverId: item?._id,
            })
          }
          style={{
            padding: 10,
            width: 80,
            backgroundColor: "#0066b2",
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});
