import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {setindex} from '../actions.js';
import firestore from '@react-native-firebase/firestore';
export default function Reelcamerapost({navigation, route}) {
  const {image, imagename} = route.params;
  const db = firestore();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const reeldata = useSelector(state => state.reeldata.reeldata);
  const upload = () => {
   /* const data = {
      uploadedby: user.email,
      imageurl: image,
      uploaderpropic: user.profilepic,
      timestamp: new Date(),
      uploadername: user.username,
    };
    let newImageCollection = db
      .collection('reels')
      .doc(reeldata.reelid)
      .collection('reelimages')
      .doc();
    newImageCollection.set(data);
    let id = newImageCollection.id;
    dispatch(setindex(0));
    console.log(id);*/
    navigation.navigate('ReelView', {
      image: image,
      imagename: imagename,
      
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Image style={{flex: 1, resizeMode: 'contain'}} source={{uri: image}} />
        <View style={styles.uploadview}>
          <TouchableOpacity style={styles.uploadbutton} onPress={upload}>
            <Text style={styles.text}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  potrait: {},
  uploadbutton: {
    width: '30%',
    height: 40,
    backgroundColor: '#F0F3F4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadview: {
    position: 'absolute',
    width: '100%',
    bottom: 30,
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
  actcontainer: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscape: {
    width: '100%',
    height: '40%',
    transform: [{rotate: '90deg'}],
  },
});
