import React from 'react';
import StackNavigator from './Navigation/StackNavigator.js';
import {NavigationContainer} from '@react-navigation/native';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './store.js';
import firebase from '@react-native-firebase/app';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR SENTRY LINK',
});

const firebaseConfig = {
  //config
}
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
