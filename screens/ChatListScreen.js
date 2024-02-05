import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AxiosApi from "../api/AxiosApi";
import Common from "../utils/Common";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  chatListContainer: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  chatRoom: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    padding: 15,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  chatName: {
    fontSize: 24,
    marginBottom: 10,
    color: "#444",
  },
  chatDate: {
    fontSize: 16,
    color: "#666",
    textAlign: "right",
  },
  circleFixedButton: {
    position: "absolute",
    bottom: 24,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1da1f2",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonLabel: {
    fontSize: 30,
    color: "white",
  },
});

const ChatListScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getChatRoom = async () => {
      try {
        const resp = await AxiosApi.chatList();
        setChatRooms(resp.data);
      } catch (e) {
        // Error handling remains similar to your original implementation
      }
    };
    const intervalID = setInterval(getChatRoom, 1000);
    return () => clearInterval(intervalID);
  }, []);

  const enterChatRoom = (roomId) => {
    navigation.navigate("Chatting", { roomId });
  };

  const createChatRoom = () => {
    navigation.navigate("ChatCreate");
  };

  return (
    <View style={styles.chatListContainer}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatRoom}
            onPress={() => enterChatRoom(item.roomId)}
          >
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.chatDate}>
              {Common.formatDate(item.regDate)}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.roomId}
      />
      <TouchableOpacity
        style={styles.circleFixedButton}
        onPress={createChatRoom}
      >
        <Text style={styles.buttonLabel}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatListScreen;
