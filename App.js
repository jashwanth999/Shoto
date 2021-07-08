import React from 'react';
import {StatusBar} from 'react-native';
import StackNavigator from './Navigation/StackNavigator.js';
import {NavigationContainer} from '@react-navigation/native';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './store.js';
import * as Sentry from '@sentry/react-native';
Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
});
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Setting a timer for a long period of time']);
LogBox.ignoreLogs(['Deprecated: Native Google Sign-In has been moved']);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar backgroundColor="#EA8BA5" />
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
