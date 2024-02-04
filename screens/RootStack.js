import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainTab from "./MainTab";
import Login from "./LoginScreen";
import Signup from "./SignUpScreen";
import EditProfileScreen from "./EditProfileScreen";
import CategoryScreen from "./CategoryScreen";
import BoardWriteScreen from "./BoardWriteScreen";
import MyLocationScreen from "./MyLocationScreen";
import { initFirebase } from "../api/firebase";

const Stack = createStackNavigator();

const RootStack = () => {
  useEffect(() => {
    (async () => {
      try {
        const app = initFirebase();
        console.log("Firebase initialized: ", app);
      } catch (err) {
        console.error("Firebase initialization error: ", err);
      }
    })();
  }, []);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: "로그인" }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: "회원 가입" }}
      />
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ title: "프로필 편집" }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ title: "카테고리 편집" }}
      />
      <Stack.Screen
        name="BoardWrite"
        component={BoardWriteScreen}
        options={{ title: "게시글 작성" }}
      />
      <Stack.Screen
        name="MyLocationScreen"
        component={MyLocationScreen}
        options={{ title: "내 위치" }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
