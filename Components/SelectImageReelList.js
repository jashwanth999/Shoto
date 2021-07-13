import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';

import {MaterialIcons} from '../Styles/Icons.js';
import {useDispatch} from 'react-redux';
import {Addreeldata, setindex} from '../actions.js';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

export default function Reellist({navigation, name, id, t, image, imagename}) {
  const db = firestore();
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
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

  const upload = () => {
    dispatch(setindex(0));
    navigation.navigate('ReelView', {
      image: image,
      imagename: imagename,
    });
    dispatch(
      Addreeldata({
        reelname: name,
        reelid: id,
      }),
    );
  };

  return (
    <TouchableOpacity
      onPress={upload}
      activeOpacity={0.9}
      style={styles.reelContainer}>
      <View style={styles.top}>
        <Text style={styles.reelCardName}>{name}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.imageLengthText}>
            {t.split(' ')[0]} {t.split(' ')[1]} {t.split(' ')[2]}-
          </Text>
          <Text style={styles.imageLengthText}>{images.length} photos</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <ContributorsView reelUsers={reelUsers} />
        <TouchableOpacity style={styles.save}>
          <Text style={styles.saveButtonText}>SAVE</Text>
          <MaterialIcons
            name="chevron-right"
            color="rgba(36, 123, 160, 0.8)"
            size={20}
            style={styles.saveIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
const ContributorsView = ({reelUsers}) => {
  return (
    <View style={styles.contributorsView}>
      {reelUsers.map((users, index) => {
        if (index < 3) {
          return (
            <Image
              key={index}
              source={{uri: users.profilepic}}
              style={styles.contributorsAvatar}
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
const styles = StyleSheet.create({
  reelContainer: {
    height: 110,
    marginTop: 8,
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
  },
  save: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
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
});
