import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import AxiosApi from "../api/AxiosApi";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initFirebase } from "../api/firebase";
import BoardCateSelect from "../components/board/BoardCateSelect";

initFirebase();

const BoardWriteScreen = () => {
  const [title, setTitle] = useState(""); // For text input
  const [content, setContent] = useState(""); // For text input
  const [fileUri, setFileUri] = useState(""); // For image picking
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const data = await AsyncStorage.getItem("email");
        if (data) {
          setEmail(data);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load email from storage");
      }
    };

    const loadCategories = async () => {
      try {
        const response = await AxiosApi.cateList();
        setCategories(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to load categories");
      }
    };

    loadEmail();
    loadCategories();
  }, []);

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to grant photo access to use this feature"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setFileUri(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("Validation Error", "Title and content are required");
      return;
    }

    try {
      let url = fileUri;

      if (fileUri) {
        const filename = fileUri.split("/").pop();
        const storage = getStorage();
        const storageRef = ref(storage, `/board/${filename}`);
        const response = await fetch(fileUri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        url = await getDownloadURL(storageRef);
      }

      const response = await AxiosApi.boardWrite(
        email,
        title,
        selectedCategory,
        content,
        url
      );
      if (response.data) {
        Alert.alert("Success", "Your post has been submitted successfully");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit post");
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setFileUri("");
    setSelectedCategory("all");
  };

  return (
    <ScrollView style={styles.container}>
      <BoardCateSelect
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
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
      <Button title="이미지 선택" onPress={handleImagePick} />
      <View style={styles.margin} />
      {fileUri ? (
        <Image source={{ uri: fileUri }} style={styles.image} />
      ) : null}

      <View style={styles.buttonContainer}>
        <Button title="글쓰기" onPress={handleSubmit} />
        <Button title="취소" onPress={handleReset} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  margin: {
    marginBottom: 10,
  },
});

export default BoardWriteScreen;