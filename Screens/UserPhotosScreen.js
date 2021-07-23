import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import {Header} from 'react-native-elements';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import LoadingView from '../Components/ReelViewComponents.js/LoadingView.js';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeleteOverlay from '../Components/ReelViewComponents.js/Delete.js';

export default function UserPhotos({navigation}) {
  const Image = createImageProgress(FastImage);
  const db = firestore();
  const numColumns = 3;
  const size = (Dimensions.get('window').width - 15) / numColumns;
  const reeldata = useSelector(state => state.reeldata.reeldata);
  const [reelid, setReelId] = useState('');
  const [imageid, setImageId] = useState('');

  const user = useSelector(state => state.user.user);

  // get details of reels stored in reducers

  // get images of reels stored in reducers

  const [isLoading, setIsLoading] = useState(false);

  const [userPhotos, setUserPhotos] = useState([]);
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    db.collection('user_reels')
      .doc(user?.email)
      .collection('AllUserPhotos')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setUserPhotos(
          snapshot.docs.map(doc => ({
            imageid: doc.id,
            images: doc.data(),
          })),
        );
        setIsLoading(true);
      });
  }, [user?.email]);
  const renderImage = useCallback(({item, index}) => {
    //const t = new Date(item.images?.timestamp?.seconds * 1000).toUTCString();

    return (
      <TouchableOpacity
        onLongPress={() => {
          toggleOverlay();
          setReelId(item.images.reelid);
          setImageId(item.imageid);
        }}
        onPress={() => {
          navigation.navigate('Photoview', {
            cloudOriginalImage: item.images.cloudMediumImage,
            timestamp: new Date(
              item.images?.timestamp?.seconds * 1000,
            ).toUTCString(),
            time: item.images?.date,
          });
        }}>
        <Image
          resizeMode="cover"
          style={[styles.image, {height: size, width: size}]}
          source={{
            uri: item.images.cloudMediumImage,
          }}
        />
      </TouchableOpacity>
    );
  }, []);

  const deleteFromEveryWhere = () => {
    let deleteFromReelImages = db
      .collection('reels')
      .doc(reelid)
      .collection('reelimages')
      .doc(imageid);
    let deleteFromUserPhotos = db
      .collection('user_reels')
      .doc(user.email)
      .collection('AllUserPhotos')
      .doc(imageid);

    try {
      deleteFromReelImages.delete();
      deleteFromUserPhotos.delete();
    } catch (error) {
      // SnackBarComponent('Image not deleted please retry');
    }
    toggleOverlay();
  };

  return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        leftComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Shotohome');
            }}
            style={styles.leftHeader}>
            <Ionicons name="chevron-back" color="#d4d4d4" size={21} />
          </TouchableOpacity>
        }
        centerComponent={
          <View style={styles.headerNameContainer}>
            <Text style={styles.allUserPhotoText}>All Your Photos</Text>
          </View>
        }
      />
      <StatusBar backgroundColor="#1d2533" />

      {!isLoading ? (
        <LoadingView />
      ) : (
        <FlatList
          initialNumToRender={10}
          updateCellsBatchingPeriod={30}
          ListHeaderComponent={<View style={{marginTop: 20}}></View>}
          removeClippedSubviews={false}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          data={userPhotos}
          renderItem={renderImage}
          keyExtractor={item => item.imageid}
          numColumns={numColumns}
        />
      )}
      <DeleteOverlay
        deleteAction={deleteFromEveryWhere}
        toggleOverlay={toggleOverlay}
        visible={visible}
        deleteHead={'Delete Permanently'}
        deleteSubHead={'From Everywhere'}
        height={160}
        iconName={'delete-forever'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(14,14,14,1)',
  },
  header: {
    backgroundColor: '#1d2533',
    borderBottomColor: '#1d2533',
    height: 90,
  },
  headerNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 4,
    marginTop: 4,
  },

  imagesView: {
    marginRight: 3,
  },
  allUserPhotoText: {
    color: '#d4d4d4',
    fontSize: 18,
  },
  leftHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
  },
  homeText: {
    color: '#d4d4d4',
    fontSize: 15,
  },
  image: {
    margin: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  text: {
    color: '#d4d4d4',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  allYourPhotosView: {
    marginTop: 30,
    marginBottom: 15,
  },
});
