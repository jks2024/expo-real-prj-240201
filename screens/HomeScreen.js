import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MovieCardView from "../components/MovieCardView"; // 이 경로는 적절히 조정하세요
import AxiosApi from "../api/AxiosApi"; // 이 경로는 적절히 조정하세요

const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchTotalPage = async () => {
        try {
          const res = await AxiosApi.moviePage(0, 10);
          setTotalPage(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTotalPage();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchMovies = async () => {
        try {
          const res = await AxiosApi.moviePageList(currentPage, 10);
          console.log(res.data);
          setMovies(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchMovies();
    }, [currentPage])
  );

  const handlePageChange = (number) => {
    console.log(number);
    setCurrentPage(number - 1);
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
        <TouchableOpacity
          key={page}
          style={styles.pageButton}
          onPress={() => handlePageChange(page)}
        >
          <Text>{page}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.cardContainer}>
        {movies.map((movie) => (
          <MovieCardView
            key={movie.rank.toString()}
            rank={movie.rank}
            image={movie.image}
            title={movie.title}
            score={movie.score}
            rate={movie.rate}
            reservation={movie.reservation}
            date={movie.date}
          />
        ))}
      </View>
      {renderPagination()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#eee",
    padding: 20,
    gap: 8,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  pageButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    width: 28,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
