import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

// 현재 화면의 너비를 가져옵니다.
const { width, height } = Dimensions.get("window");

const MovieCardView = ({
  rank,
  image,
  title,
  score,
  rate,
  reservation,
  date,
}) => {
  return (
    <View style={styles.cardView}>
      <View style={styles.ranking}>
        <Text style={styles.rankingText}>{rank}</Text>
      </View>
      <Image source={{ uri: image }} style={styles.poster} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.rating}>평점 : {score}</Text>
      <Text style={styles.participants}>{rate}</Text>
      <Text style={styles.reservationRate}>예매율 : {reservation}</Text>
      <Text style={styles.releaseDate}>개봉일 : {date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    flexDirection: "column",
    alignItems: "center",
    width: width * 0.9, // 카드 너비를 화면 너비의 90%로 설정
    height: 350, // 카드 높이를 350으로 설정
    alignSelf: "center",
    borderColor: "#ddd",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  ranking: {
    position: "absolute",
    width: 50,
    height: 30,
    top: 20,
    left: 16,
    backgroundColor: "orange",
    // 왼쪽 상단 곡률만 적용
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "center", // 수직 정렬
    alignItems: "center", // 수평 정렬
    zIndex: 1,
    // 텍스트 그림자 추가
    textShadowColor: "rgba(0, 0, 0, 0.85)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  poster: {
    width: "90%", // 이미지 크기 조정
    height: "50%", // 이미지 높이 조정
    margin: 20, // 이미지 주변 여백
    borderRadius: 5,
  },
  title: {
    fontSize: 20, // 제목 폰트 크기 조정
    fontWeight: "bold",
    textAlign: "center",
  },
  rating: {
    fontSize: 18, // 평점 폰트 크기 조정
    fontWeight: "bold",
    color: "black",
  },
  participants: {
    fontSize: 16, // 참가자 정보 폰트 크기 조정
    color: "black",
  },
  reservationRate: {
    fontSize: 16, // 예매율 폰트 크기 조정
    color: "black",
  },
  releaseDate: {
    fontSize: 16, // 개봉일 정보 폰트 크기 조정
    color: "black",
  },
});

export default MovieCardView;
