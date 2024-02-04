import React, { useContext, useState, useCallback } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { UserContext } from "../contexts/UserContext";

const MapScreen = () => {
  const { location } = useContext(UserContext);
  const [region, setRegion] = useState(null);

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
      >
        <Marker
          coordinate={region}
          title="내 위치"
          description="내가 지금 있는 곳"
        />
      </MapView>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapScreen;
