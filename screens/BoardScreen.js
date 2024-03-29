import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import AxiosApi from "../api/AxiosApi";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BoardList from "../components/board/BoardList";
import BoardCateSelect from "../components/board/BoardCateSelect";

const BoardScreen = () => {
  const [boardList, setBoardList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchCategories = async () => {
        const response = await AxiosApi.cateList();
        setCategories(response.data);
      };
      fetchCategories();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchBoardList = async () => {
        const response = await AxiosApi.boardList();
        const filteredList =
          selectedCategory === "all"
            ? response.data
            : response.data.filter(
                (board) => board.categoryId === parseInt(selectedCategory)
              );
        setBoardList(filteredList);
      };

      fetchBoardList();
    }, [selectedCategory])
  );

  const onSelect = useCallback((selectCate) => {
    setSelectedCategory(selectCate);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cateSelectContainer}>
        <BoardCateSelect
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={onSelect} // 선택한 카테고리를 변경하는 함수
        />
      </View>
      <View style={styles.boardListContainer}>
        <BoardList
          boardList={boardList}
          onItemPress={(item) =>
            navigation.navigate("BoardDetail", { boardId: item.boardId })
          }
        />
      </View>
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => navigation.navigate("BoardWrite")}
      >
        <Text style={styles.writeButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cateSelectContainer: {
    height: 50,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  boardListContainer: {
    flex: 1, // 나머지 공간을 모두 차지하도록 설정
  },
  writeButton: {
    position: "absolute",
    bottom: 24,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange", // KakaoTalk's iconic yellow for the primary action button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  writeButtonText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
});

export default BoardScreen;
