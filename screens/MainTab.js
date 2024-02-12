import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import ChatListScreen from "./ChatListScreen";
import BoardScreen from "./BoardScreen";
import MyInfoScreen from "./MyInfoScreen";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();
const activeIconColor = "#000000"; // Black color for active icons
const inactiveIconColor = "#c7c7c7"; // Grey color for inactive icons
const tabBarBackgroundColor = "#f0f0f0";

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: activeIconColor, // Active icon color
        tabBarInactiveTintColor: inactiveIconColor, // Inactive icon color
        tabBarShowLabel: true, // Show text label as per the updated KakaoTalk style
        tabBarLabelStyle: {
          fontSize: 10, // Adjust label font size for aesthetics
        },
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor, // Slight grey background color for the tab bar
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "홈") {
            iconName = "home";
          } else if (route.name === "게시판") {
            iconName = "dashboard";
          } else if (route.name === "내주변") {
            iconName = "my-location";
          } else if (route.name === "채팅") {
            iconName = "chat";
          } else if (route.name === "내정보") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{ tabBarLabel: "홈" }}
      />
      <Tab.Screen
        name="게시판"
        component={BoardScreen}
        options={{ tabBarLabel: "게시판" }}
      />
      <Tab.Screen
        name="내주변"
        component={MapScreen}
        options={{ tabBarLabel: "내주변" }}
      />
      <Tab.Screen
        name="채팅"
        component={ChatListScreen}
        options={{ tabBarLabel: "채팅" }}
      />
      <Tab.Screen
        name="내정보"
        component={MyInfoScreen}
        options={{ tabBarLabel: "내정보" }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
