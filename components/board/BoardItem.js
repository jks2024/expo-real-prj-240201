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
  boardItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "white", // Use a warm background color
    borderRadius: 10, // Round corners for a softer look
    marginVertical: 5, // Add some vertical spacing between items
    marginHorizontal: 10, // Add some horizontal margin
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  boardImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 40, // Make the image round to align with KakaoTalk's profile image style
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  boardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Darker color for better readability
  },
  boardContent: {
    color: "#666", // Soften the content color for readability
  },
  mailAndDate: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  email: {
    fontStyle: "italic",
    fontSize: 12,
    color: "#777", // Soften the email color
  },
  boardDate: {
    fontSize: 12,
    color: "#999", // Use a lighter color for the date to keep focus on title and content
    textAlign: "right",
  },
});

export default BoardItem;
