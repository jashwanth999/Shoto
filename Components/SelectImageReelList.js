import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { MaterialIcons } from '../Styles/Icons.js';
import {useDispatch} from 'react-redux';
import {Addreeldata, clearScrollData, setindex} from '../actions.js';
import {db, auth} from '../Security/firebase.js';
import * as FileSystem from 'expo-file-system';
import {RNS3} from 'react-native-aws3';
import {useSelector} from 'react-redux';
export default function Reellist({navigation, name, id, t, image, imagename}) {
  const currentUser = auth.currentUser;
  const user = useSelector(state => state.user.user);
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
  const dispatch = useDispatch();
  const [reelusers, setreelusers] = useState([]);
  const [images, setimages] = useState([]);
  const [act, setAct] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection('reels')
      .doc(id)
      .collection('reelusers')
      .where('useremail', '!=', user?.email)
      .onSnapshot(snapshot => {
        setreelusers(snapshot.docs.map(doc => doc.data()));
      });
    return unsubscribe;
  }, [id]);

  useEffect(() => {
    const unsubscribe = db
      .collection('reels')
      .doc(id)
      .collection('reelimages')
      .onSnapshot(val => {
        setimages(
          val.docs.map(doc => ({
            id: doc.id,
            localimage: FileSystem.documentDirectory + doc.id + '.jpg',
            imagess: doc.data(),
          })),
        );
      });
    return unsubscribe;
  }, [id]);

  const setreel = () => {
    // set reel details to reducers
    dispatch(
      Addreeldata({
        reelname: name,
        reelid: id,
        imageslength: images.length,
      }),
    );
    // navigating to reelview
    navigation.navigate('ReelView');
  };
  const upload = () => {
    navigation.navigate('ReelView');
    db.collection('reels')
      .doc(id)
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
        dispatch(
          Addreeldata({
            reelname: name,
            reelid: id,
            imageslength: images.length,
          }),
        );

        RNS3.put(file, options).then(response => {
          if (response.status !== 201) {
            alert('Some error occurred');
          } else {
            try {
              db.collection('reels')
                .doc(id)
                .collection('reelimages')
                .doc(res.id)
                .update({
                  imageurl: response.body.postResponse.location,
                });
            } catch (error) {
              alert(error.message);
            }
          }
        });
      });
  };

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.reelcontainer}>
      <View style={styles.top}>
        <Text style={{color: '#d4d4d4', fontSize: 15, fontWeight: 'bold'}}>
          {name}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#d4d4d4', fontSize: 12}}>
            {t.split(' ')[0]} {t.split(' ')[1]} {t.split(' ')[2]}-
          </Text>
          <Text style={{color: '#d4d4d4', fontSize: 12}}>
            {images.length} photos
          </Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.contributorsView}>
          {reelusers.map((users, index) => {
            if (index < 3) {
              return (
                <Image
                  key={index}
                  source={{uri: users.profilepic}}
                  style={styles.contributorsavatar}
                />
              );
            }
          })}
          {reelusers.length > 3 ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 3,
              }}>
              <MaterialIcons name="add" color="white" size={13} />
              <Text style={{color: 'white', marginRight: 10}}>
                {reelusers.length - 3}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
        </View>

        {!act ? (
          <View style={{marginRight: 20}}>
            <ActivityIndicator color="#d4d4d4" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={act ? upload : () => {}}
            style={styles.clickapic}>
            <Text style={{color: '#d4d4d4'}}>Save</Text>
            <MaterialIcons name="chevron-right" color="#d4d4d4" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  reelcontainer: {
    height: 110,
    marginTop: 8,
    backgroundColor: 'rgba(14,14,14,1)',
    flexDirection: 'column',
  },

  contributorsavatar: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  contributorsView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    margin: 15,
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: 13,
  },
  bottom: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clickapic: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
});
