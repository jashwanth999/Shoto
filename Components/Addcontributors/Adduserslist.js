import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Ionicons, MaterialCommunityIcons} from '../../Styles/Icons';
import Userlist from './Userlist';
import {useSelector, useDispatch} from 'react-redux';
import {reeluseremail} from '../../actions';
import firestore from '@react-native-firebase/firestore';

export default function Adduserslist({navigation}) {
  const db = firestore();
  const [profilepic, setProfilePic] = useState(null);
  const [inputEmail, setInputEmail] = useState('');

  const [admin, setAdmin] = useState('');

  const dispatch = useDispatch();

  // get emails list stored in reducers

  const emails = useSelector(state => state.emails.emails);

  // get details of reel stored in reducers

  const reeldata = useSelector(state => state.reeldata.reeldata);

  // validating email using regex concept

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  useEffect(() => {
    const unsubscribe = db
      .collection('reels')
      .doc(reeldata.reelid)
      .onSnapshot(doc => {
        setAdmin(doc.data()?.created_useremail);
      });
    return unsubscribe;
  }, [reeldata.reelid]);

  // get reel user emails

  useEffect(() => {
    const unsubscribe = db
      .collection('reels')
      .doc(reeldata.reelid)
      .collection('reelusers')
      .onSnapshot(snapshot => {
        dispatch(
          reeluseremail(snapshot.docs.map(doc => doc.data()?.useremail)),
        );
      });
    return unsubscribe;
  }, [reeldata.reelid]);

  // get user profie pics

  useEffect(() => {
    if (inputEmail) {
      const unsubscribe = db
        .collection('users')
        .doc(inputEmail.toLowerCase())
        .onSnapshot(doc => {
          setProfilePic(doc.data()?.profilepic);
        });
      return unsubscribe;
    }
  }, [inputEmail]);
  const add = () => {
    // adding users to reels

    if (inputEmail && validateEmail(inputEmail.toLowerCase())) {
      try {
        setInputEmail('');
        db.collection('reels')
          .doc(reeldata.reelid)
          .collection('reelusers')
          .doc(inputEmail.toLowerCase())
          .set({
            useremail: inputEmail.toLowerCase(),
            profilepic: profilepic
              ? profilepic
              : 'https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
            timestamp: new Date(),
            reelid: reeldata.reelid,
          });

        db.collection('user_reels')
          .doc(inputEmail.toLowerCase())
          .collection('reellist')
          .doc(reeldata.reelid)
          .set({
            reelname: reeldata.reelname,
            timestamp: new Date(),
          });
      } catch (error) {
        alert('some error as occured');
      }
    } else {
      alert("It's not a valid email");
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent reelname={reeldata.reelname} navigation={navigation} />
      <StatusBar backgroundColor="#1d2533" />
      <View style={styles.inputView}>
        <Text style={styles.typeEmailText}>
          Type email id of the people you want to add
        </Text>
        <TextInput
          value={inputEmail}
          onChangeText={text => setInputEmail(text)}
          placeholder="abc@example.com"
          placeholderTextColor="grey"
          style={styles.textinput}
        />
      </View>
      <View style={styles.addView}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={add}
          style={styles.addButton}>
          <Text style={styles.addText}> ADD</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{marginTop: 15, marginLeft: 10}}>
        {emails.map((users, index) => (
          <Userlist key={index} useremail={users} admin={admin} />
        ))}
      </ScrollView>
    </View>
  );
}
const HeaderComponent = ({navigation, reelname}) => {
  return (
    <Header
      containerStyle={styles.header}
      leftComponent={
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ReelView');
          }}>
          <Ionicons name="chevron-back" color="#d4d4d4" size={24} />
        </TouchableOpacity>
      }
      centerComponent={
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
          {reelname}
        </Text>
      }
      rightComponent={
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Shotohome');
          }}>
          <MaterialCommunityIcons
            name="checkbox-marked-circle-outline"
            color="white"
            size={26}
          />
        </TouchableOpacity>
      }
    />
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  header: {
    backgroundColor: '#1d2533',
    borderBottomColor: '#1d2533',
    height: 90,
  },
  textinput: {
    color: 'white',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    width: '90%',
    fontSize: 16,
    paddingBottom: 2,
    paddingTop: 0,
    marginLeft: 10,
  },
  inputView: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'column',
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#1d2533',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  addView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  addText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeEmailText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
