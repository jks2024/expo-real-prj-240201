import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";

const BoardCateSelect = ({ categories, selectedCategory, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.categoryId}
          style={[
            styles.category,
            selectedCategory === category.categoryId && styles.selected,
          ]}
          onPress={() => onSelect(category.categoryId)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.categoryId && styles.selectedText,
            ]}
          >
            {category.categoryName}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    marginRight: 5,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    borderColor: "#22bbcf",
    backgroundColor: "#22bbcf",
  },
  categoryText: {
    color: "#333",
  },
  selectedText: {
    color: "white",
  },
});

export default BoardCateSelect;
