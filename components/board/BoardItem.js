import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Commons from "../../utils/Common";

const BoardItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.boardItem} onPress={onPress}>
      <Image
        source={{ uri: item.img ? item.img : "http://via.placeholder.com/160" }}
        style={styles.boardImage}
      />
      <View style={styles.contentWrapper}>
        <Text style={styles.boardTitle}>{item.title}</Text>
        <Text style={styles.boardContent}>{item.content}</Text>
        <View style={styles.mailAndDate}>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.boardDate}>
            {Commons.timeFromNow(item.regDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  mailAndDate: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boardTitle: {
    fontSize: 18,
    color: "#007bff",
  },
  email: {
    fontStyle: "italic",
    textAlign: "right",
    fontSize: 12,
    color: "#555",
  },
  boardContent: {
    color: "#444",
  },
  boardDate: {
    alignItems: "flex-end",
    color: "#777",
    fontSize: 12,
    textAlign: "right",
  },
  boardItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  boardImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
});

// Add styles here

export default BoardItem;
