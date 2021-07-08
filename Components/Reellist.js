import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '../Styles/Icons.js';
import {useDispatch, useSelector} from 'react-redux';
import {Addreeldata, setindex, updateLocalImages} from '../actions.js';
import {db, auth} from '../Security/firebase.js';

import FastImage from 'react-native-fast-image';

import ImagePicker from 'react-native-image-crop-picker';
import {RNS3} from 'react-native-aws3';

export default function Reellist({navigation, name, id, t}) {
  const dispatch = useDispatch();
  const [reelusers, setreelusers] = useState([]);
  const [images, setimages] = useState([]);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (user?.email) {
      const unsubscribe = db
        .collection('reels')
        .doc(id)
        .collection('reelusers')
        .where('useremail', '!=', user?.email)
        .onSnapshot(snapshot => {
          setreelusers(snapshot.docs.map(doc => doc.data()));
        });
      return unsubscribe;
    }
  }, [id]);

  useEffect(() => {
    const unsubscribe = db
      .collection('reels')
      .doc(id)
      .collection('reelimages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(val => {
        setimages(
          val.docs.map(doc => ({
            id: doc.id,
            imagess: doc.data(),
          })),
        );
      });
    return unsubscribe;
  }, [id]);
  var today = new Date();
  today =
    parseInt(today.getMonth() + 1) +
    ' ' +
    today.getDate() +
    ' ' +
    today.getHours() +
    ':' +
    today.getMinutes();

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
    navigation.navigate('ReelView', {
      image: '',
      imagename: '',
    });
  };

  const Clickapic = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
    }).then(image => {
      dispatch(
        Addreeldata({
          reelname: name,
          reelid: id,
          imageslength: images.length,
        }),
      );
     
      navigation.navigate('ReelView', {
        image: image.path,
        imagename: image.path.replace(/^.*[\\\/]/, ''),
      });
      dispatch(
        updateLocalImages({
          id: '',
          reelimages: {
            uploadedby: user.email,
            imageurl: image.path,
            uploaderpropic: user.profilepic,
            timestamp: '',
            uploadername: user.username,
            time: today,
          },
        }),
      );
      dispatch(setindex(0));
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.reelcontainer}
      onPress={setreel}>
      <View style={styles.top}>
        <Text style={{color: '#d4d4d4', fontSize: 15, fontWeight: 'bold'}}>
          {name}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#d4d4d4', fontSize: 12}}>
            {Number(t?.split(' ')[4]?.split(':')[0]) +
              5 +
              ':' +
              Number(t?.split(' ')[4]?.split(':')[1])}
            - {t?.split(' ')[1]} {t?.split(' ')[2]} {t?.split(' ')[3]}
          </Text>
          <Text style={{color: '#d4d4d4', fontSize: 12}}>
            - {images.length} photos
          </Text>
        </View>
      </View>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          {images[0]?.imagess.imageurl ? (
            <FastImage
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={{
                height: 95,
                margin: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
              source={{
                uri: images[0]?.imagess.imageurl,
              }}
            />
          ) : (
            <FastImage
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={{
                height: 95,
                margin: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
              source={require('../assets/phimage2.jpg')}
            />
          )}
        </View>
        <View style={{flex: 1}}>
          {images[1]?.imagess.imageurl ? (
            <FastImage
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={{
                height: 95,
                margin: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
              source={{
                uri: images[1]?.imagess.imageurl,
              }}
            />
          ) : (
            <FastImage
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={{
                height: 95,
                margin: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
              source={require('../assets/phimage3.jpg')}
            />
          )}
        </View>
        <View style={{flex: 1}}>
          {images[2]?.imagess.imageurl ? (
            <FastImage
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={{
                height: 95,
                margin: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
              source={{
                uri: images[2]?.imagess.imageurl,
              }}
            />
          ) : (
            <FastImage
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={{
                height: 95,
                margin: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
              source={require('../assets/phimage4.jpg')}
            />
          )}
        </View>
        <View style={{flex: 1}}>
          {images[3]?.imagess.imageurl ? (
            <FastImage
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={{
                height: 95,
                margin: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
              source={{
                uri: images[3]?.imagess.imageurl,
              }}
            />
          ) : (
            <FastImage
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={{
                height: 95,
                margin: 3,
                borderRadius: 4,
                overflow: 'hidden',
              }}
              source={require('../assets/phimage11.jpg')}
            />
          )}
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.contributorsView}>
          {reelusers.map((users, index) => {
            if (index < 3) {
              return (
                <FastImage
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
        <TouchableOpacity onPress={Clickapic} style={styles.clickapic}>
          <Text style={{color: '#d4d4d4'}}>Click a pic</Text>
          <MaterialIcons name="chevron-right" color="#d4d4d4" size={20} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  reelcontainer: {
    height: 215,
    marginTop: 10,
    backgroundColor: 'rgba(14,14,14,1)',
    flexDirection: 'column',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },

  contributorsavatar: {
    height: 20,
    width: 20,
    borderRadius: 20,
    overflow: 'hidden',
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
