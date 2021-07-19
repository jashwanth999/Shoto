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
import {Addreel, Adduser} from '../actions';
import auth from '@react-native-firebase/auth';
import OverLayComponent from '../Components/UserProfileComponents/OverLayComponent';
import HelloComponent from '../Components/UserProfileComponents/HelloComponent';

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
    await auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login');

        // clear data
        toggleOverlay();
        dispatch(Addreel(null));
        dispatch(Adduser(null));
      });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.header}>
        <HelloComponent />
        <Text style={styles.userNameText}>{user?.username}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Shotohome');
          }}
          style={styles.backButtonView}>
          <Ionicons name="chevron-back" color="#d4d4d4" size={21} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutIconButton}
        onPress={() => {
          toggleOverlay();
        }}>
        <MaterialCommunityIcons name="logout" color="white" size={22} />
      </TouchableOpacity>

      <View style={styles.avatarView}>
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
      <View style={styles.saveView}>
        <TouchableOpacity style={styles.saveContainer}>
          <Text style={styles.caption}>Save</Text>
        </TouchableOpacity>
      </View>
      <OverLayComponent
        visible={visible}
        toggleOverlay={toggleOverlay}
        actionName={'Do you want to logout ?'}
        action={signOut}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  backButtonView: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: 10,
    top: 40,
  },
  backButtonText: {
    color: '#d4d4d4',
    fontSize: 15,
  },
  avatarView: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    top: '40%',
  },
  saveView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutIconButton: {
    position: 'absolute',
    right: 10,
    top: 40,
  },
});

export default UserProfile;
