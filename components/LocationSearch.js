import { StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAP_KEY } from "../utils/env";

const LocationSearch = ({ onLocationSelected }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="주소 검색"
      fetchDetails={true}
      keepResultsAfterBlur={true}
      enablePoweredByContainer={false}
      GooglePlacesSearchQuery={{
        rankby: "distance",
      }}
      onPress={(data, details = null) => {
        if (details) {
          onLocationSelected({
            name: data.description,
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          });
        }
        console.log("주소 가져오기 : ", data.description);
      }}
      query={{
        key: MAP_KEY,
        language: "ko",
      }}
      styles={styles.search}
    />
  );
};

const styles = StyleSheet.create({
  search: {
    // container 감싸고 있는 컴포넌트
    container: {},
    // input을 감싸는 컴포넌트
    textInputContainer: {
      flexDirection: "row",
    },
    // input창
    textInput: {
      borderWidth: 1,
      borderColor: "gray",
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
      paddingVertical: 9,
      paddingHorizontal: 12,
      fontSize: 16,
      color: "#6c6c6e",
    },
    // 검색결과 리스트 컴포넌트
    listView: {
      backgroundColor: "#ffffff",
      borderRadius: 10,
      paddingHorizontal: 10,
      elevation: 8,
      shadowColor: "#6164BB",
    },
    // 검색결과 행
    row: {
      paddingVertical: 20,
    },
    // 검색결과 divided line
    separator: {
      height: 1,
      backgroundColor: "#c8c7cc",
    },
    // 검색결과 text
    description: {
      fontSize: 15,
    },
  },
});

export default LocationSearch;
