import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Slidey from "./Slidey";
import { SafeAreaProvider } from "react-native-safe-area-context";
import createSlideyTabNavigator from "./createSlideyTabNavigator";

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const { navigate } = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile!</Text>
    </View>
  );
}

function ComingSoonScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Coming Soon!</Text>
    </View>
  );
}

const Tab = createSlideyTabNavigator();

function AppNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Explore"
          component={HomeStack}
          options={{ header: () => null }}
        />
        <Tab.Screen name="Trending" component={ComingSoonScreen} />
        <Tab.Screen name="Search" component={ComingSoonScreen} />
        <Tab.Screen name="Library" component={ComingSoonScreen} />
        <Tab.Screen name="Settings" component={ComingSoonScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      {/* <AppNav /> */}
      <Slidey />
    </SafeAreaProvider>
  );
}
