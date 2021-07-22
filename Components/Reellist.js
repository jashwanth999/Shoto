import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '../Styles/Icons.js';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import ContributorsView from './ReelListComponents/ContributorsView.js';
import ImageThumbnail from './ReelListComponents/ReelImageThumbNail';
import {useDispatch} from 'react-redux';
import {Addreeldata} from '../actions.js';
export default function Reellist({name, id, t, setReel, ClickaPic,navigation}) {
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
            reelimages: doc.data(),
          })),
        );
      });
    return unsubscribe;
  }, [id]);

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setReel(name, id);
        }}>
        {/* The upper part of the card leads to the reel screen */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{name}</Text>

          <Text style={styles.infoText}>
            {t.split(' ')[0]} {t.split(' ')[1]} {t.split(' ')[2]}{' '}
            {t.split(' ')[3]}
            {' - '}
            {images.length} photos
          </Text>
        </View>

        <View style={styles.thumbnailsContainer}>
          {images.slice(0, 4).map((item, index) => {
            if (
              (item.reelimages?.isUploadedMedium === false &&
                item.reelimages?.uploadedby === user.email) ||
              item.reelimages?.isUploadedMedium === true
            ) {
              return (
                <ImageThumbnail
                  key={index}
                  imageUri={
                    item.reelimages?.isUploadedMedium
                      ? item.reelimages?.cloudMediumImage
                      : item.reelimages?.localMediumImage
                  }
                />
              );
            }
          })}
        </View>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <ContributorsView reelUsers={reelusers} />
        <TouchableOpacity
          onPress={() => {
            dispatch(Addreeldata({reelname: name, reelid: id}));
            ClickaPic(navigation, 'ReelView');
          }}
          style={styles.clickaPicButton}>
          <Text style={styles.clickaPicButtonText}>CLICK</Text>
          <MaterialIcons
            name="chevron-right"
            color="rgba(36, 123, 160, 0.8)"
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    backgroundColor: 'rgba(18,18,18,1)',
    flexDirection: 'column',
  },
  thumbnailsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    fontWeight: 'bold',
    marginVertical: 2,
  },
  infoText: {
    color: 'rgba(212, 212, 212, 0.8)',
    fontSize: 12,
    fontWeight: 'normal',
  },
  clickaPicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  clickaPicButtonText: {
    // color: "rgba(212, 212, 212, 0.6)",
    color: 'rgba(36, 123, 160, 0.8)',
    fontWeight: 'bold',
  },
});
