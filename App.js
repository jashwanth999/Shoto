import React from 'react';
import StackNavigator from './Navigation/StackNavigator.js';
import {NavigationContainer} from '@react-navigation/native';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './store.js';
import firebase from '@react-native-firebase/app';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://4eb4bfb52b7b4d4290142957f88b6223@o918657.ingest.sentry.io/5862073',
});

const firebaseConfig = {
  apiKey: 'AIzaSyBJFyW2KfP5Uo0E3gyYzFJ5W2LDGJnciXo',
  authDomain: 'shotography-6a40e.firebaseapp.com',
  projectId: 'shotography-6a40e',
  storageBucket: 'shotography-6a40e.appspot.com',
  messagingSenderId: '821295087358',
  appId: '1:821295087358:web:0a97e8bffbb5add9d06faf',
  measurementId: 'G-MM7V9R0R3X',
  databaseURL: 'https://shotography-6a40e-default-rtdb.firebaseio.com/',
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Setting a timer for a long period of time']);
LogBox.ignoreLogs(['Deprecated: Native Google Sign-In has been moved']);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
