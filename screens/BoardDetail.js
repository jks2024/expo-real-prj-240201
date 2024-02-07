import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AxiosApi from "../api/AxiosApi";
import { useNavigation, useRoute } from "@react-navigation/native";
import Common from "../utils/Common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BoardDetail = () => {
  const route = useRoute(); // useRoute 훅을 사용하여 route 객체를 가져옵니다.
  const { boardId } = route.params; // route.params를 사용하여 boardId를 가져옵니다.
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [inputComment, setInputComment] = useState("");
  const [comAddFlag, setComAddFlag] = useState(false);
  const [loginUserEmail, setLoginUserEmail] = useState("");
  const [showComments, setShowComments] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      const isLogin = await AsyncStorage.getItem("isLogin");
      if (isLogin !== "TRUE") {
        navigation.navigate("Login");
      } else {
        setLoginUserEmail(await AsyncStorage.getItem("email"));
      }
    };
    load();
  }, []);

  useEffect(() => {
    const getBoardDetail = async () => {
      try {
        const response = await AxiosApi.boardDetail(boardId);
        setBoard(response.data);
        const response2 = await AxiosApi.commentList(boardId);
        setComments(response2.data);
        const response3 = await AxiosApi.memberGetOne(loginUserEmail);
        setLoginUserEmail(response3.data.email);
      } catch (e) {
        console.log(e);
      }
    };
    if (loginUserEmail) {
      getBoardDetail();
    }
  }, [comAddFlag, boardId, loginUserEmail]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const modifyBoard = () => {
    // Implement board modification logic
  };

  const deleteBoard = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this board?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            // Implement board deletion logic
          },
        },
      ]
    );
  };

  const handleSubmitComment = async () => {
    try {
      const response = await AxiosApi.commentWrite(
        boardId,
        loginUserEmail,
        inputComment
      );
      setInputComment("");
      setComAddFlag(!comAddFlag);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.fieldContainer}>
        <Image
          source={{ uri: board?.img || "http://via.placeholder.com/160" }}
          style={styles.boardImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{board?.title}</Text>
          <Text style={styles.content}>{board?.content}</Text>
          <Text style={styles.boardDate}>
            {Common.timeFromNow(board?.regDate)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleComments} style={styles.button}>
          <Text style={styles.buttonText}>
            {showComments ? "댓글 보기" : `댓글 숨기기 (${comments.length})`}
          </Text>
        </TouchableOpacity>
        {loginUserEmail === board?.email && (
          <>
            <TouchableOpacity onPress={modifyBoard} style={styles.button}>
              <Text style={styles.buttonText}>수정하기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteBoard} style={styles.button}>
              <Text style={styles.buttonText}>삭제하기</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TextInput
        style={styles.commentInput}
        value={inputComment}
        onChangeText={setInputComment}
        placeholder="댓글 추가하기"
      />
      <TouchableOpacity
        onPress={handleSubmitComment}
        style={styles.submitButton}
      >
        <Text style={styles.submitButtonText}>Submit Comment</Text>
      </TouchableOpacity>
      {showComments &&
        comments.map((comment, index) => (
          <View key={index} style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentEmail}>{comment.email}</Text>
              <Text style={styles.commentDate}>
                {Common.timeFromNow(comment.regDate)}
              </Text>
            </View>
            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  boardImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  boardDate: {
    fontSize: 14,
    color: "#777",
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#68d785",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#ffffff",
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentEmail: {
    fontStyle: "italic",
    color: "#555",
  },
  commentDate: {
    fontSize: 14,
    color: "#999",
  },
  commentContent: {
    fontSize: 16,
    color: "#333",
  },
});

export default BoardDetail;
