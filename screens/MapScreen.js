import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { UserContext } from "../contexts/UserContext";
import AxiosApi from "../api/AxiosApi";

const MapScreen = () => {
  const { location } = useContext(UserContext);
  const [region, setRegion] = useState(null);
  const [boardList, setBoardList] = useState([]);
  const [selectBoard, setSelectBoard] = useState(null);
  const navigation = useNavigation();

  const updateRegion = useCallback(() => {
    if (location && location.latitude && location.longitude) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location.latitude, location.longitude]); // 의존성 배열을 구체적인 속성으로 변경

  useFocusEffect(updateRegion);

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await AxiosApi.boardList();
        console.log(response.data);
        setBoardList(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBoardList();
  }, [region]);

  if (!region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>위치 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // initialRegion 대신 region 사용
        onRegionChangeComplete={updateRegion} // 지도 상의 위치 변경 시 region 갱신
        onPress={(e) => {
          // 지도의 다른 부분을 터치했을 때만 실행되도록 함
          if (e.nativeEvent.action === undefined) {
            setSelectBoard(null);
          }
        }}
      >
        {boardList.map((board) => (
          <Marker
            key={board.boardId}
            coordinate={{
              latitude: board.latitude,
              longitude: board.longitude,
            }}
            title={board.address}
            onPress={() => setSelectBoard(board)}
          />
        ))}
      </MapView>
      {selectBoard && (
        <TouchableOpacity
          style={styles.infoBar}
          onPress={() =>
            navigation.navigate("BoardDetail", { boardId: selectBoard.boardId })
          }
        >
          <Image source={{ uri: selectBoard.img }} style={styles.image} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>제목: {selectBoard.title}</Text>
            <Text style={styles.infoText}>내용: {selectBoard.content}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  infoBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row", // 이미지와 텍스트를 가로로 배열
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 6,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5, // 제목과 내용 사이의 간격
  },
  infoText: {
    fontSize: 16,
  },
});
export default MapScreen;
