import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../Screens/Login.js';
import ShotoHome from '../Screens/ShotoHome.js';
import ReelView from '../Screens/ReelView.js';
import ImageView from '../Screens/ImageView.js';
import Splashscreen from '../Screens/Splashscreen';
import Adduserslist from '../Screens/Adduserslist.js';
import Photoview from '../Screens/Photoview.js';
import UserProfile from '../Screens/UserProfile.js';
import SelectImageScreen from '../Screens/SelectImageScreen.js';
import auth from '@react-native-firebase/auth';
import UserPhotos from '../Screens/UserPhotosScreen.js';

const Stack = createStackNavigator();
export default function StackNavigator() {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splashscreen" component={Splashscreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Shotohome" component={ShotoHome} />
      <Stack.Screen name="ReelView" component={ReelView} />
      <Stack.Screen name="ImageView" component={ImageView} />
      <Stack.Screen name="Adduserlist" component={Adduserslist} />
      <Stack.Screen name="Photoview" component={Photoview} />
      <Stack.Screen name="userprofile" component={UserProfile} />
      <Stack.Screen name="selectimagescreen" component={SelectImageScreen} />
      <Stack.Screen name="AllUserPhotos" component={UserPhotos} />
    </Stack.Navigator>
  );
}
