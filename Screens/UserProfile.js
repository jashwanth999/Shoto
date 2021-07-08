import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {Ionicons, MaterialCommunityIcons} from '../Styles/Icons';
import {useSelector, useDispatch} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../Security/firebase';
import {Overlay} from 'react-native-elements';
import {Addreel, Adduser} from '../actions';
function Hello() {
  return (
    <View style={styles.helloContainer}>
      <Text style={[styles.helloText, {color: '#0F9D58'}]}>H</Text>
      <Text style={[styles.helloText, {color: '#DB4437'}]}>e</Text>
      <Text style={[styles.helloText, {color: '#4285F4'}]}>l</Text>
      <Text style={[styles.helloText, {color: '#4285F4'}]}>l</Text>
      <Text style={[styles.helloText, {color: '#F4B400'}]}>o</Text>
      <Text style={[styles.helloText, {color: '#0F9D58'}]}>!</Text>
    </View>
  );
}

function UserProfile({navigation}) {
  GoogleSignin.configure({
    scopes: [], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '821295087358-f7nsmu3rup0ghfflnvk7ret61mv49gec.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });

  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const signOut = async () => {
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem('email');
    await auth.signOut().then(() => {
      navigation.navigate('Login');

      // clear data
      toggleOverlay();
      dispatch(Addreel(null));
      dispatch(Adduser(null));
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
      <View style={styles.header}>
        <Hello />
        <Text style={styles.userNameText}>{user?.username}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Shotohome');
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            left: 10,
            top: 40,
          }}>
          <Ionicons name="chevron-back" color="#d4d4d4" size={21} />
          <Text style={{color: '#d4d4d4', fontSize: 15}}>Back</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{position: 'absolute', right: 10, top: 40}}
        onPress={() => {
          toggleOverlay();
        }}>
        <MaterialCommunityIcons name="logout" color="white" size={22} />
      </TouchableOpacity>

      <View
        style={{
          width: '100%',
          alignItems: 'center',
          position: 'absolute',
          top: '40%',
        }}>
        <Avatar
          source={{
            uri: user?.profilepic,
          }}
          size={100}
          rounded
        />
      </View>
      <View style={{marginTop: 52}}>
        <View style={styles.textInputView}>
          <MaterialCommunityIcons
            name={'account'}
            size={20}
            color="rgba(29, 37, 51, 1)"
          />
          <TextInput
            style={styles.input}
            placeholder="Type Here ..."
            color="#d4d4d4"
          />
        </View>
        <View style={styles.textInputView}>
          <MaterialCommunityIcons
            name="phone"
            size={20}
            color="rgba(29, 37, 51, 1)"
          />
          <TextInput
            style={styles.input}
            placeholder="+91 99999 99999"
            color="#d4d4d4"
          />
        </View>
      </View>
      <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
        <TouchableOpacity style={styles.saveContainer}>
          <Text style={styles.caption}>Save</Text>
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={visible}
        overlayStyle={{
          backgroundColor: 'white',
          borderRadius: 10,
          width: '80%',
          height: 100,
          borderRadius: 5,
        }}
        onBackdropPress={toggleOverlay}
        backdropStyle={{backgroundColor: 'rgba( 0, 0, 0, 0.8)'}}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 10,
            marginTop: 10,
          }}>
          {' '}
          Do you want to logout ?
        </Text>
        <View
          style={{
            position: 'absolute',
            right: 15,
            bottom: 15,
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={toggleOverlay}>
            <Text
              style={{
                color: '#29A7EC',
                fontSize: 18,
                fontWeight: 'bold',
                marginRight: 10,
              }}>
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut}>
            <Text
              style={{
                color: '#29A7EC',
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(29, 37, 51, 1)',
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    alignSelf: 'center',
    color: '#d4d4d4',
    fontSize: 24,
    marginTop: 10,
  },
  helloContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
  helloText: {
    alignSelf: 'center',
    color: '#d4d4d4',
    fontSize: 40,
    fontWeight: '800',
    margin: 4,
  },
  materialButton: {
    minHeight: 40,
    width: '40%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,212,212,1)',
    margin: 20,
  },

  input: {
    flex: 1,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
  },
  saveContainer: {
    backgroundColor: '#27364b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    width: '40%',
    height: 40,
  },
  textInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.25,
    borderBottomColor: 'rgba(29, 37, 51, 1)',
    marginLeft: 20,
    marginRight: 20,
  },
});

export default UserProfile;
