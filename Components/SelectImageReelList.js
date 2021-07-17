import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '../Styles/Icons.js';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import ContributorsView from './ReelListComponents/ContributorsView.js';
export default function Reellist({name, id, t, upload}) {
  const db = firestore();
  const user = useSelector(state => state.user.user);
  //const dispatch = useDispatch();
  const [reelUsers, setreelusers] = useState([]);
  const [images, setimages] = useState([]);

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
            imagess: doc.data(),
          })),
        );
      });
    return unsubscribe;
  }, [id]);

  return (
    <TouchableOpacity
      onPress={() => {
        upload(name, id);
      }}
      activeOpacity={0.9}
      style={styles.reelContainer}>
      <View style={styles.top}>
        <Text style={styles.reelCardName}>{name}</Text>
        <View style={styles.imagesTextView}>
          <Text style={styles.imageLengthText}>
            {t.split(' ')[0]} {t.split(' ')[1]} {t.split(' ')[2]}{' '}
            {t.split(' ')[3]}
            {' - '}
            {images.length} photos
          </Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <ContributorsView reelUsers={reelUsers} />
        <View style={styles.save}>
          <Text style={styles.saveButtonText}>SAVE</Text>
          <MaterialIcons
            name="chevron-right"
            color="rgba(36, 123, 160, 0.8)"
            size={20}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  reelContainer: {
    height: 110,
    marginVertical: 5,
    backgroundColor: 'rgba(14,14,14,1)',
    flexDirection: 'column',
  },
  reelCardName: {
    color: '#d4d4d4',
    fontSize: 15,
    fontWeight: 'bold',
  },

  contributorsAvatar: {
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  save: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  saveButtonText: {
    color: 'rgba(36, 123, 160, 0.8)',
    fontWeight: 'bold',
  },
  saveIcon: {
    marginTop: 2,
  },
  imageLengthText: {
    color: '#d4d4d4',
    fontSize: 12,
  },
  imagesTextView: {
    flexDirection: 'row',
  },
});
