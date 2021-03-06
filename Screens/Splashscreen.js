import React, {useEffect} from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import {Adduser} from '../actions.js';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
export default function Spashscreen({navigation}) {
  const dispatch = useDispatch();
  const _retrieveData = async () => {
    try {
      // checking whether the user is login or not  using asynstorage

      const value = await AsyncStorage.getItem('email');
      if (value) {
        // if login already goes to home page
        navigation.navigate('Shotohome');
        dispatch(Adduser({email: value}));
      } else {
        // else goes to login page
        navigation.navigate('Login');
      }
    } catch (error) {
      Sentry.captureMessage(error.message);
    }
  };
  useEffect(() => {
    _retrieveData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1d2533" />
      <Image source={require('../assets/shoto.png')} style={styles.shotoLogo} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#1d2533',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  shotoLogo: {
    height: 160,
    width: 160,
    marginBottom: 16,
  },
});
