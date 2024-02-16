import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AxiosApi from "../api/AxiosApi";
import { useNavigation, useRoute } from "@react-navigation/native";
import Commons from "../utils/Common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chatting = () => {
  const [inputMsg, setInputMsg] = useState("");
  const [chatList, setChatList] = useState([]);
  const [sender, setSender] = useState("");
  const [roomName, setRoomName] = useState("");
  const ws = useRef(null);
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const { roomId } = route.params;

  useEffect(() => {
    const loadEmailAndFetchMember = async () => {
      try {
        // AsyncStorage에서 email 정보를 가져옵니다.
        const data = await AsyncStorage.getItem("email");
        console.log("email : ", data);
        if (data) {
          try {
            const rsp = await AxiosApi.memberGetOne(data); // 이전에 setEmail로 세팅된 email 대신, 여기서 바로 data를 사용합니다.
            console.log("보내는 사람 : ", rsp.data.name);
            setSender(rsp.data.name); // Sender 상태를 업데이트합니다.
          } catch (memberError) {
            console.log(memberError); // 멤버 정보 가져오기 실패 시 로그를 출력합니다.
          }
        }
      } catch (emailError) {
        Alert.alert("이메일을 불러오는데 실패했습니다."); // email 정보 가져오기 실패 시 알림을 띄웁니다.
      }
    };

    loadEmailAndFetchMember(); // 정의한 비동기 함수를 호출합니다.
  }, []);

  useEffect(() => {
    const getChatRoom = async () => {
      try {
        const rsp = await AxiosApi.chatDetail(roomId); // Adjust API call if necessary
        console.log(rsp.data.name);
        setRoomName(rsp.data.name);
      } catch (e) {
        console.log(e);
      }
    };
    getChatRoom();
  }, [roomId]);

  useEffect(() => {
    if (!ws.current) {
      initiateWebSocketConnection();
    } else {
      console.log("WebSocket already connected");
    }

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []); // 웹소켓 연결은 sender가 설정된 후에 시도됩니다.

  const initiateWebSocketConnection = () => {
    console.log("Connecting to WebSocket");
    ws.current = new WebSocket(Commons.SERVER_SOCKET_URL);
    ws.current.onopen = () => {
      console.log("connected");
      sendWebSocketMessage("ENTER", "처음으로 접속 합니다.");
    };
    ws.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      setChatList((prevItems) => [...prevItems, data]);
    };
  };

  const sendWebSocketMessage = (type, message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: type,
          roomId: roomId,
          sender: sender,
          message: message,
        })
      );
    }
  };

  const sendMessage = () => {
    if (inputMsg.trim() !== "") {
      sendWebSocketMessage("TALK", inputMsg);
      setInputMsg("");
    }
  };

  const closeChat = () => {
    sendWebSocketMessage("CLOSE", "종료 합니다.");
    ws.current.close();
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS는 padding, Android는 height
      keyboardVerticalOffset={Platform.OS === "ios" ? 96 : 0} // iOS에서 헤더 또는 상단 바 높이에 따라 조정
    >
      <View style={styles.container}>
        <Text style={styles.header}>채팅방 {roomName}</Text>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          keyboardShouldPersistTaps="handled" // 키보드가 활성 상태일 때 탭 관리
          contentContainerStyle={{ paddingBottom: 100 }} // 스크롤뷰 하단에 여백 추가
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {chatList.map((chat, index) => (
            <View
              key={index}
              style={[
                styles.message,
                chat.sender === sender ? styles.sender : styles.receiver,
              ]}
            >
              <Text>{`${chat.sender} > ${chat.message}`}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="문자 전송"
            value={inputMsg}
            onChangeText={setInputMsg}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.buttonText}>전송</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={closeChat} style={styles.closeButton}>
          <Text style={styles.buttonText}>채팅 종료 하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  message: {
    maxWidth: "60%",
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  sender: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  receiver: {
    backgroundColor: "#E0E0E0",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 4,
  },
  closeButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});

export default Chatting;
