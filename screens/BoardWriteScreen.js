import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import AxiosApi from "../api/AxiosApi";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initFirebase } from "../api/firebase";
import BoardCateSelect from "../components/board/BoardCateSelect";
import LocationSearch from "../components/LocationSearch";

initFirebase();

const BoardWriteScreen = () => {
  const [title, setTitle] = useState(""); // For text input
  const [content, setContent] = useState(""); // For text input
  const [fileUri, setFileUri] = useState(""); // For image picking
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState({});

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const data = await AsyncStorage.getItem("email");
        if (data) {
          setEmail(data);
        }
      } catch (error) {
        Alert.alert("이메일을 불러오는데 실패했습니다.");
      }
    };

    const loadCategories = async () => {
      try {
        const response = await AxiosApi.cateList();
        setCategories(response.data);
      } catch (error) {
        Alert.alert("카테고리 목록을 불러오는데 실패했습니다.");
      }
    };

    loadEmail();
    loadCategories();
  }, []);

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("퍼미션 에러", "사진을 선택하기 위해서는 권한이 필요합니다.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      setFileUri(pickerResult.assets[0].uri);
    }
  };

  const handlePhotoPick = async () => {
    const cameraPermissionResult =
      await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermissionResult.granted) {
      Alert.alert("퍼미션 에러", "카메라를 사용하기 위한 권한이 필요합니다.");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      setFileUri(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || selectedCategory === "all") {
      Alert.alert(
        "Validation Error",
        "Title, content, and category are required."
      );
      return;
    }

    try {
      const filename = fileUri.split("/").pop();
      const storage = getStorage();
      const storageRef = ref(storage, `/board/${filename}`);
      const response = await fetch(fileUri);
      const blob = await response.blob();
      // 파일 업로드
      await uploadBytes(storageRef, blob);
      // 업로드된 이미지의 URL 가져오기
      const url = await getDownloadURL(storageRef);

      const rsp = await AxiosApi.boardWrite(
        email,
        title,
        selectedCategory,
        content,
        url,
        location.name,
        location.latitude,
        location.longitude
      );
      if (rsp.data) {
        Alert.alert("게시글 작성 성공", "게시글이 성공적으로 작성되었습니다.");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("게시글 작성 실패", "게시글 작성에 실패했습니다.");
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setFileUri("");
    setSelectedCategory("all");
  };

  const handleImagePress = () => {
    Alert.alert(
      "프로필 사진 설정",
      "프로필 사진으로 설정할 방법을 선택하세요.",
      [
        {
          text: "사진 선택",
          onPress: handleImagePick,
        },
        {
          text: "카메라",
          onPress: handlePhotoPick,
        },
        {
          text: "취소",
          onPress: () => {},
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Android에 대해 "height" 사용
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BoardCateSelect
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <View style={styles.margin} />
        <TextInput
          style={styles.input}
          onChangeText={setTitle}
          value={title}
          placeholder="제목"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          onChangeText={setContent}
          value={content}
          placeholder="내용"
          multiline
          numberOfLines={4}
        />
        <LocationSearch
          onLocationSelected={(selectedLocation) => {
            setLocation(selectedLocation);
          }}
        />
        {location.name && (
          <View>
            <Text style={styles.locationInfo}>{location.name}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePress}>
          <Text style={styles.imagePickerText}>이미지 선택</Text>
        </TouchableOpacity>
        {fileUri ? (
          <Image source={{ uri: fileUri }} style={styles.image} />
        ) : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>글쓰기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleReset}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
  },
  image: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    fflexDirection: "row",
    justifyContent: "space-between", // Adjusted for better spacing
    paddingHorizontal: 20, // Add padding for outer spacing
    marginTop: 20,
  },
  margin: {
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#FEE500", // KakaoTalk yellow
    paddingVertical: 10,
    paddingHorizontal: 30, // Adjusted for better button sizing
    borderRadius: 5,
    alignItems: "center",
    flex: 1, // Adjust for equal spacing
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#F8F8F8", // Light gray
    paddingVertical: 10,
    paddingHorizontal: 30, // Adjusted for better button sizing
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  imagePicker: {
    backgroundColor: "#E0E0E0", // Subtle grey for the button
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#000", // Black text for better contrast
  },
  buttonText: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  locationInfo: {
    fontSize: 12,
    marginBottom: 12,
  },
});

export default BoardWriteScreen;
