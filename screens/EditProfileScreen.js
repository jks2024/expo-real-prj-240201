import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initFirebase } from "../api/firebase";
import AxiosApi from "../api/AxiosApi";

initFirebase();

const EditProfileScreen = ({ route, navigation }) => {
  const { member } = route.params;
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [profileImage, setProfileImage] = useState({
    uri: member.image || "https://example.com/path/to/default/image.jpg",
  });

  const handleChoosePhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      console.log("Image picker result: ", pickerResult.assets[0].uri);
      setProfileImage({ uri: pickerResult.assets[0].uri });
    }
  };

  const handleSave = async () => {
    try {
      const extension = profileImage.uri.split(".").pop(); // 확장자 추출
      const filename = `${email.split("@")[0]}.${extension}`; // 파일 이름 결정
      const storage = getStorage();
      const storageRef = ref(storage, `profile/${filename}`);

      // Fetch the image as blob
      const response = await fetch(profileImage.uri);
      console.log("Fetched image as blob", response);
      const blob = await response.blob();

      // 파일 업로드
      await uploadBytes(storageRef, blob);
      console.log("Uploaded a blob or file!");

      // 업로드된 이미지의 URL 가져오기
      const url = await getDownloadURL(storageRef);
      setProfileImage({ ...profileImage, uri: url });
      console.log("New image URL: ", url);

      // 회원 정보 수정 API 호출
      await AxiosApi.memberUpdate(email, name, url);

      // 성공 알림
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );

      // 이전 화면으로 돌아가기
      navigation.goBack();
    } catch (error) {
      // 오류 처리
      console.error("Error updating profile: ", error);
      Alert.alert("Update Failed", "Failed to update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleChoosePhoto}
      >
        <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
        <View style={styles.overlayContainer}>
          <Text style={styles.editText}>편집</Text>
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={false} // 수정 불가
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 34,
  },
  input: {
    height: 42,
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  profileImage: {
    marginVertical: 60,
    width: 130,
    height: 130,
    backgroundColor: "lightgray",
    borderRadius: 65,
  },
  overlayContainer: {
    position: "absolute",
    top: 90,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  editText: {
    color: "white",
    padding: 5,
    borderRadius: 5,
  },
});

export default EditProfileScreen;
