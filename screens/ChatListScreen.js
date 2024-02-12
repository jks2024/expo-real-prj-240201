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
    backgroundColor: "white",
  },
  chatRoom: {
    backgroundColor: "#fff",
    borderWidth: 0, // Remove border to make it cleaner
    marginBottom: 10,
    padding: 15,
    borderRadius: 10, // Rounded corners for a softer look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // subtle shadow for depth
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center items vertically in the container
  },
  chatName: {
    fontSize: 20,
    color: "#444",
    flex: 1,
  },
  chatDate: {
    fontSize: 14,
    color: "#999",
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
    backgroundColor: "orange",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
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
