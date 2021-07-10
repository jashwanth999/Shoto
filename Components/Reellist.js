import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '../Styles/Icons.js';
import {useDispatch, useSelector} from 'react-redux';
import {Addreeldata, clearScrollData, setindex} from '../actions.js';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';

export default function Reellist({navigation, name, id, t}) {
  const db = firestore();
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

  const setReel = () => {
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
      reelid: '',
    });
  };

  const ClickaPic = () => {
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
      dispatch(clearScrollData());
      dispatch(setindex(0));
      db.collection('reels')
        .doc(id)
        .collection('reelimages')
        .add({
          uploadedby: user.email,
          imageurl: image.path,
          uploaderpropic: user.profilepic,
          timestamp: new Date(),
          uploadername: user.username,
        })
        .then(res => {
          navigation.navigate('ReelView', {
            image: image.path,
            imagename: image.path.replace(/^.*[\\\/]/, ''),
            reelid: res.id,
          });
        });
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={setReel}
      style={[styles.container]}>
      {/* The upper part of the card leads to the reel screen */}
      <TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{name}</Text>

          <Text style={styles.infoText}>
            {t.split(' ')[0]} {t.split(' ')[1]} {t.split(' ')[2]} {' - '}
            {images.length} photos
          </Text>
        </View>

        <View style={styles.thumbnailsContainer}>
          {images.slice(0, 4).map((image, index) => (
            <ImageThumbnail key={index} imageUri={image.imagess?.imageurl} />
          ))}
        </View>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <ContributorsPics reelUsers={reelusers} />

        <TouchableOpacity onPress={ClickaPic} style={styles.clickaPicButton}>
          <Text style={styles.clickaPicButtonText}>CLICK</Text>
          <MaterialIcons
            name="chevron-right"
            color="rgba(36, 123, 160, 0.8)"
            size={20}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const ContributorsPics = ({reelUsers}) => {
  return (
    <View style={styles.contributorsView}>
      {reelUsers.map((users, index) => {
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
      {reelUsers.length > 3 ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 3,
          }}>
          <MaterialIcons name="add" color="white" size={13} />
          <Text style={{color: 'white', marginRight: 10}}>
            {reelUsers.length - 3}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
};

const ImageThumbnail = ({imageUri}) => {
  return (
    <View style={{flex: 1}}>
      <FastImage
        indicatorProps={{
          size: 40,
          borderWidth: 0,
          color: 'rgba(150, 150, 150, 1)',
          unfilledColor: 'rgba(200, 200, 200, 0.2)',
        }}
        style={{
          height: 95,
          marginHorizontal: 2,
          borderRadius: 2,
          overflow: 'hidden',
        }}
        source={{
          uri: imageUri,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    // backgroundColor: '#000',
    backgroundColor: 'rgba(18,18,18,1)',
    flexDirection: 'column',
  },
  thumbnailsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: 'rgba(18,18,18,1)',
  },
  bottomContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  contributorsavatar: {
    height: 20,
    width: 20,
    borderRadius: 100,
    overflow: 'hidden',
  },
  contributorsView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  titleText: {
    color: 'rgba(212, 212, 212, 0.8)',
    fontSize: 14,
    fontWeight: '800',
    marginVertical: 2,
  },
  infoText: {
    color: 'rgba(212, 212, 212, 0.8)',
    fontSize: 12,
    fontWeight: '300',
  },
  clickaPicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  clickaPicButtonText: {
    // color: "rgba(212, 212, 212, 0.6)",
    color: 'rgba(36, 123, 160, 0.8)',
    fontWeight: '800',
  },
});
