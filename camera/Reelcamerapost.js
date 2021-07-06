import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {db, auth} from '../Security/firebase.js';
import {useSelector, useDispatch} from 'react-redux';
import {clearScrollData, setindex} from '../actions.js';
import {RNS3} from 'react-native-aws3';
export default function Reelcamerapost({navigation, route}) {
  const {image, imagename} = route.params;
  const currentUser = auth.currentUser;

  const dispatch = useDispatch();
  const [act, setAct] = useState(true);
  const user = useSelector(state => state.user.user);
  const reeldata = useSelector(state => state.reeldata.reeldata);
  const file = {
    uri: image,
    name: imagename,
    type: 'image/png',
  };

  const options = {
    keyPrefix: `uploads/${currentUser.uid}/`,
    bucket: 'shotoclick',
    region: 'ap-south-1',
    accessKey: 'AKIAR77UFFI6JWKBCVUU',
    secretKey: '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',
    successActionStatus: 201,
  };
  const upload = () => {
    navigation.navigate('ReelView');
    db.collection('reels')
      .doc(reeldata.reelid)
      .collection('reelimages')
      .add({
        uploadedby: user.email,
        imageurl: image,
        uploaderpropic: user.profilepic,
        timestamp: new Date(),
        uploadername: user.username,
        profilepic: user.profilepic,
      })
      .then(res => {
        dispatch(clearScrollData());
        dispatch(setindex(0));
        
        RNS3.put(file, options).then(response => {
          if (response.status !== 201) {
            alert('Some error occurred');
          } else {
            
              db.collection('reels')
                .doc(reeldata.reelid)
                .collection('reelimages')
                .doc(res.id)
                .update({
                  imageurl: response.body.postResponse.location,
                });
            
          }
        });
      });
  };
  return (
    <View style={styles.container}>
      {act ? (
        <View style={styles.container}>
          <Image
            style={{flex: 1, resizeMode: 'contain'}}
            source={{uri: image}}
          />
          <View style={styles.uploadview}>
            <TouchableOpacity style={styles.uploadbutton} onPress={upload}>
              <Text style={styles.text}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.actcontainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
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
