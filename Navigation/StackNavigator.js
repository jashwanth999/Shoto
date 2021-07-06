import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../auth/Login.js";
import ShotoHome from "../Components/ShotoHome.js";
import ReelView from "../Components/ReelView.js";
import ImageView from "../Components/ImageView.js";
import Splashscreen from "../Components/Splashscreen";
import Reelcamerapost from "../camera/Reelcamerapost.js";
import Adduserslist from "../Components/Addcontributors/Adduserslist.js";
import Photoview from "../Components/Photoview.js";
import UserProfile from "../Screens/UserProfile.js";
import SelectImageScreen from "../Screens/SelectImageScreen.js";
const Stack = createStackNavigator();
export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splashscreen" component={Splashscreen} />
      <Stack.Screen name="Reelcamerapost" component={Reelcamerapost} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Shotohome" component={ShotoHome} />
      <Stack.Screen name="ReelView" component={ReelView} />
      <Stack.Screen name="ImageView" component={ImageView} />
      <Stack.Screen name="Adduserlist" component={Adduserslist} />
      <Stack.Screen name="Photoview" component={Photoview} />
      <Stack.Screen name="userprofile" component={UserProfile} />
      <Stack.Screen name="selectimagescreen" component={SelectImageScreen} />
    </Stack.Navigator>
  );
}
