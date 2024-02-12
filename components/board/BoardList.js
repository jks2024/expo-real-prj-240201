import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import BoardItem from "./BoardItem";

const BoardList = ({ boardList, onItemPress }) => {
  return (
    <FlatList
      style={styles.block}
      data={boardList}
      renderItem={({ item }) => (
        <BoardItem item={item} onPress={() => onItemPress(item)} />
      )}
      keyExtractor={(item) => item.boardId.toString()}
    />
  );
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
export default BoardList;
