import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export default function AllUserPhotosReelCard({navigation}) {
  const Image = createImageProgress(FastImage);
  const numColumns = 4;
  const size = (Dimensions.get('window').width - 15) / numColumns;

  const user = useSelector(state => state.user.user);
  const [userPhotos, setUserPhotos] = useState([]);
  const db = firestore();
  const dispatch = useDispatch();
  useEffect(() => {
    db.collection('user_reels')
      .doc(user?.email)
      .collection('AllUserPhotos')
      .orderBy('timestamp', 'desc')
      .limit(8)
      .onSnapshot(snapshot => {
        setUserPhotos(
          snapshot.docs.map(doc => ({
            imageid: doc.id,
            images: doc.data(),
          })),
        );
      });
  }, [user?.email]);
  const imageThumbnail = useCallback(({item, index}) => {
    return (
      <View>
        <Image
          resizeMode="cover"
          style={[styles.image, {height: size, width: size}]}
          source={{
            uri: item.images.cloudMediumImage,
          }}
        />
      </View>
    );
  }, []);

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AllUserPhotos');
        }}
        activeOpacity={0.8}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>All Photos</Text>
        </View>

        <View style={styles.thumbnailsContainer}>
          <FlatList
            initialNumToRender={10}
            updateCellsBatchingPeriod={30}
            removeClippedSubviews={false}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            data={userPhotos}
            renderItem={imageThumbnail}
            keyExtractor={item => item.imageid}
            numColumns={numColumns}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.moreButtonView}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AllUserPhotos');
          }}
          style={styles.moreButton}>
          <Text style={styles.moreButtonText}>MORE</Text>
          <MaterialIcons
            name="chevron-right"
            color="rgba(36, 123, 160, 0.8)"
            size={22}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    backgroundColor: 'black',
  },
  thumbnailsContainer: {
    width: '100%',
    flexDirection: 'row',
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
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    marginRight: 10,
  },
  moreButtonText: {
    // color: "rgba(212, 212, 212, 0.6)",
    color: 'rgba(36, 123, 160, 0.8)',
    fontWeight: 'bold',
  },
  image: {
    margin: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  moreButtonView: {
    flexDirection: 'row-reverse',
    marginBottom: 5,
  },
});
