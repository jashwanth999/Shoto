import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  BackHandler,
} from 'react-native';

import {auth, db} from '../Security/firebase.js';
import firebase from '@firebase/app';
import {Adduser} from '../actions.js';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}) {
  const [act, setact] = useState(true); // Activity Indicator
  GoogleSignin.configure({
    scopes: [], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '821295087358-f7nsmu3rup0ghfflnvk7ret61mv49gec.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });
  const dispatch = useDispatch();

  // back navigation lock

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  // checking if the google user is already there or not

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.user.id
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = async googleUser => {
    var unsubscribe = auth.onAuthStateChanged(async firebaseUser => {
      unsubscribe();
      if (!isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken,
        );
        auth
          .signInWithCredential(credential)
          .then(async authUser => {
            await db.collection('users').doc(googleUser.user.email).set({
              username: googleUser.user.name,
              email: googleUser.user.email,
              profilepic: googleUser.user.photo,
              timestamp: new Date(),
            });
            await AsyncStorage.setItem('email', googleUser.user.email);
            await AsyncStorage.setItem('profilepic', googleUser.user.photo);
            await AsyncStorage.setItem('username', googleUser.user.name);

            dispatch(Adduser({email: googleUser.user.email}));

            return authUser.user
              .updateProfile({
                username: googleUser.user.name,
                email: googleUser.user.email,
                profilepic: googleUser.user.photo,
              })
              .then(() => {
                setact(true);
                navigation.navigate('Shotohome', {
                  email: googleUser.user.email,
                });
              });
          })
          .catch(error => {
            alert(error.message);
            setact(true);
          });
      } else {
        dispatch(Adduser({email: googleUser.user.email}));
        navigation.navigate('Shotohome');
        setact(true);
      }
    });
  };

  async function signInWithGoogleAsync() {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      onSignIn(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1d2533" />

      {act ? (
        <View style={styles.container}>
          <Image
            source={require('../assets/shoto.png')}
            style={styles.shotologo}
          />
          <Text style={styles.shoto}>
            Shotography: The Art of Clicking Together
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.button}
            onPress={signInWithGoogleAsync}>
            <Image
              source={require('../assets/google.png')}
              style={styles.googlelogo}
            />
            <Text style={styles.text}>Login With Google</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size="large" color="white" />
      )}
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
  text: {
    color: 'black',
    fontSize: 15,
    margin: 5,
  },
  button: {
    backgroundColor: 'white',
    width: 200,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    display: 'flex',
    flexDirection: 'row',
  },
  shoto: {
    color: 'grey',
    fontSize: 14,
    margin: 18,
  },
  googlelogo: {
    height: 40,
    width: 40,
  },
  shotologo: {
    height: 160,
    width: 160,
    marginBottom: 16,
  },
});
