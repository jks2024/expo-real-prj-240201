import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AxiosApi from "../api/AxiosApi";
import Common from "../utils/Common";
import { useNavigation } from "@react-navigation/native"; // Assuming you're using React Navigation

const ChatRoomCreate = () => {
  const [chatRoomTitle, setChatRoomTitle] = useState("");
  const navigation = useNavigation();

  const handleCreateChatRoom = async () => {
    try {
      const response = await AxiosApi.chatCreate(chatRoomTitle);
      console.log("채팅방 생성 : ", response.data);
      navigation.navigate("Chatting", { roomId: response.data }); // Adjust navigation as per your route configuration
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    navigation.goBack(); // Use goBack for navigating to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>채팅방 생성</Text>
      <TextInput
        style={styles.input}
        value={chatRoomTitle}
        onChangeText={setChatRoomTitle}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCreateChatRoom} style={styles.button}>
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={styles.button}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#333",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#ddd",
    borderRadius: 4,
    width: 300,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#4caf50",
    padding: 10,
    margin: 5,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
  },
});

export default ChatRoomCreate;
