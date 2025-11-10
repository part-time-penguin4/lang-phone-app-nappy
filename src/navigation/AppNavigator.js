import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LearnScreen from "../screens/LearnScreen";
import ReviewScreen from "../screens/ReviewScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Kayıt" }} />

        {/* App */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Ana Ekran" }} />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ title: "Tekrar" }} />
        <Stack.Screen name="Learn" component={LearnScreen} options={{ title: "Öğren" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
