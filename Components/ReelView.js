import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  BackHandler,
  Dimensions,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Ionicons} from '../Styles/Icons.js';
import Imagecard from './Imagecard.js';
import Thumbnail from './Thumbnail.js';
import {useSelector, useDispatch} from 'react-redux';
import {Addreelimages, setindex} from '../actions.js';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import {RNS3} from 'react-native-aws3';
import ImagePicker from 'react-native-image-crop-picker';
import Footer from '../Screens/Footer.js';
import Snackbar from 'react-native-snackbar';
import ImageResizer from 'react-native-image-resizer';
import * as Sentry from '@sentry/react-native';
export default function ReelView({navigation, route}) {
  const width = Dimensions.get('window').width;
  const db = firestore();
  const {mediumImage, mediumImageName, originalImageName, originalImage} =
    route.params;
  const user = useSelector(state => state.user.user);
  const date = new Date();

  // get images of reels stored in reducers
  const reelimages = useSelector(state => state.reellistimages.reellistimages);
  const [flatRef, setFlatRef] = useState();
  const dispatch = useDispatch();
  const [lastPosition, setLastPosition] = useState(false);
  const [startAfter, setstartAfter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // get details of reels stored in reducers

  const reeldata = useSelector(state => state.reeldata.reeldata);
  const [spinner, setSpinner] = useState(false);

  const currentUser = auth().currentUser;
  const uploadCloudImage = imageid => {
    const mediumImageFile = {
      uri: mediumImage,
      name: mediumImageName,
      type: 'image/png',
    };
    const originalImageFile = {
      uri: originalImage,
      name: originalImageName,
      type: 'image/png',
    };
    const optionsForMedium = {
      keyPrefix: `uploads/${currentUser.uid}/`,
      bucket: 'shoto-resized-production',
      region: 'ap-south-1',
      accessKey: 'AKIAR77UFFI6JWKBCVUU',
      secretKey: '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',
      successActionStatus: 201,
    };
    const optionsForOriginal = {
      keyPrefix: `uploads/${currentUser.uid}/`,
      bucket: 'shotoclick',
      region: 'ap-south-1',
      accessKey: 'AKIAR77UFFI6JWKBCVUU',
      secretKey: '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',
      successActionStatus: 201,
    };
    let uploadToS3Ref = db
      .collection('reels')
      .doc(reeldata.reelid)
      .collection('reelimages')
      .doc(imageid);

    let uploadS3ToUserReels = db
      .collection('user_reels')
      .doc(user.email)
      .collection('AllUserPhotos')
      .doc(imageid);

    // Uploading Medium Image
    RNS3.put(mediumImageFile, optionsForMedium)
      .then(response => {
        if (response.status !== 201) {
          SnackBarComponent('Please check your internet connection and retry');
        } else {
          try {
            uploadToS3Ref.update({
              cloudMediumImage: response.body.postResponse.location,
              isUploadedMedium: true,
            });

            uploadS3ToUserReels.set({
              cloudMediumImage: response.body.postResponse.location,
            });
          } catch (error) {
            uploadToS3Ref.update({
              cloudMediumImage: '',
              isUploadedMedium: false,
            });
            Sentry.captureException(error.message);
            SnackBarComponent(
              'Please check your internet connection and retry',
            );
          }
        }
      })
      .catch(error => {
        uploadToS3Ref.update({
          cloudMediumImage: '',
          isUploadedMedium: false,
        });
        Sentry.captureException(error.message);
        SnackBarComponent('Please check your internet connection and retry');
      });

    //Uploading Original Image
    RNS3.put(originalImageFile, optionsForOriginal)
      .then(response => {
        if (response.status !== 201) {
          SnackBarComponent('Please check your internet connection and retry');
        } else {
          try {
            uploadToS3Ref.update({
              cloudOriginalImage: response.body.postResponse.location,
              isUploadOriginal: true,
            });
          } catch (error) {
            uploadToS3Ref.update({
              cloudOriginalImage: '',
              isUploadOriginal: false,
            });
            Sentry.captureException(error.message);
            SnackBarComponent(
              'Please check your internet connection and retry',
            );
          }
        }
      })
      .catch(error => {
        uploadToS3Ref.update({
          cloudOriginalImage: '',
          isUploadOriginal: false,
        });
        Sentry.captureException(error.message);
        SnackBarComponent('Please check your internet connection and retry');
      });
  };

  const uploadLocalImage = () => {
    const data = {
      uploadedby: user.email,
      uploaderpropic: user.profilepic,
      timestamp: new Date(),
      uploadername: user.username,
      localMediumImage: mediumImage,
      localOriginalImage: originalImage,
      isUploadedMedium: false,
      isUploadOriginal: false,
      date: date.getHours() + ':' + date.getMinutes(),
    };
    let newImageCollection = db
      .collection('reels')
      .doc(reeldata.reelid)
      .collection('reelimages');
    newImageCollection.add(data).then(res => {
      uploadCloudImage(res.id);
    });
  };
  useEffect(() => {
    if (mediumImage) {
      uploadLocalImage();
    }
  }, [mediumImage]);
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Shotohome');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  // get index  of image card stored in reducers when thumbnail clicked

  const yof = useSelector(state => state.y.y);

  // get reelimages  from firestore

  useEffect(() => {
    const unsubscribe = db
      .collection('reels')
      .doc(reeldata.reelid)
      .collection('reelimages')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .onSnapshot(snapshot => {
        const lastdata = snapshot.docs[snapshot.docs.length - 1];
        snapshot.docs.length < 10
          ? setLastPosition(true)
          : setLastPosition(false);
        if (lastdata) {
          setstartAfter(lastdata);
        } else {
          setstartAfter(null);
        }
        setIsLoading(true);
        dispatch(
          Addreelimages(
            snapshot.docs.map(doc => ({
              id: doc.id,
              reelimages: doc.data(),
            })),
          ),
        );
      });
    return unsubscribe;
  }, [reeldata.reelid]);

  const getItemLayout = (data, index) => {
    if (index === -1) return {index, length: 0, offset: 0};
    return {
      length: width * 0.86 * (2 / 3) + 20,
      offset: (width * 0.86 * (2 / 3) + 20) * index,
      index,
    };
  };

  // scroll to image card ref

  const indexscroll = () => {
    flatRef?.scrollToIndex({index: yof, animated: true});
  };
  useEffect(() => {
    indexscroll();
  }, [yof]);

  const renderFooter = () => {
    return spinner && !lastPosition ? <ActivityIndicator /> : null;
  };

  const loadMore = () => {
    if (!lastPosition) {
      setSpinner(true);
      const unsubscribe = db
        .collection('reels')
        .doc(reeldata.reelid)
        .collection('reelimages')
        .orderBy('timestamp', 'desc')
        .startAfter(startAfter)
        .limit(10)
        .onSnapshot(snapshot => {
          if (!snapshot.empty) {
            const lastdata = snapshot.docs[snapshot.docs.length - 1];
            snapshot.docs.length < 10
              ? setLastPosition(true)
              : setLastPosition(false);
            if (lastdata) {
              setstartAfter(lastdata);
            } else setstartAfter(null);
            setSpinner(false);
            dispatch(
              Addreelimages([
                ...reelimages,
                ...snapshot.docs.map(doc => ({
                  id: doc.id,
                  reelimages: doc.data(),
                })),
              ]),
            );
          }
        });
      return unsubscribe;
    }
  };

  const renderImage = useCallback(({item, index}) => {
    if (
      (item.reelimages?.isUploadedMedium === false &&
        item.reelimages?.uploadedby === user.email) ||
      item.reelimages?.isUploadedMedium === true
    ) {
      return (
        <Imagecard
          index={index}
          comments={
            item.reelimages?.noofcomments ? item.reelimages.noofcomments : 0
          }
          imageid={item.id}
          reelid={reeldata.reelid}
          navigation={navigation}
          t={new Date(item.reelimages?.timestamp.seconds * 1000).toUTCString()}
          uploadername={item.reelimages?.uploadername}
          uploaderid={item.reelimages?.uploadedby}
          useremail={reeldata.useremail}
          profilepic={item.reelimages?.uploaderpropic}
          time={item.reelimages?.timestamp}
          localMediumImage={item.reelimages?.localMediumImage}
          cloudMediumImage={item.reelimages?.cloudMediumImage}
          localOriginalImage={item.reelimages?.localOriginalImage}
          cloudOriginalImage={item.reelimages?.cloudOriginalImage}
          isUploadedMedium={item.reelimages?.isUploadedMedium}
          db={db}
          d={item.reelimages?.date}
          SnackBarComponent={SnackBarComponent}
          navigation={navigation}
        />
      );
    }
  }, []);
  const renderThumbnail = useCallback(({item, index}) => {
    if (
      (item.reelimages?.isUploadedMedium === false &&
        item.reelimages?.uploadedby === user.email) ||
      item.reelimages?.isUploadedMedium === true
    ) {
      return (
        <Thumbnail
          index={index}
          isUploadedMedium={item.reelimages?.isUploadedMedium}
          localMediumImage={item.reelimages?.localMediumImage}
          cloudMediumImage={item.reelimages?.cloudMediumImage}
        />
      );
    }
  }, []);
  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
    }).then(image => {
      ImageResizer.createResizedImage(
        image.path,
        640,
        640,
        'JPEG',
        95,
        0,
        null,
        false,
        {mode: 'cover'},
      )
        .then(response => {
          navigation.navigate('ReelView', {
            mediumImage: response.uri,
            originalImage: image.path,
            mediumImageName: response.name,
            originalImageName: image.path.replace(/^.*[\\\/]/, ''),
          });
        })
        .catch(error => {
          Sentry.captureException(error.message);
          SnackBarComponent('Please try again');
        });
    });
  };
  const SnackBarComponent = message => {
    return Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        leftComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Shotohome');
              dispatch(setindex(0));
            }}
            style={styles.leftHeader}>
            <Ionicons name="chevron-back" color="#d4d4d4" size={21} />
            <Text style={styles.homeText}>Home</Text>
          </TouchableOpacity>
        }
        centerComponent={
          <View style={styles.headerNameContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.reelnameText}>
              {reeldata.reelname}
            </Text>
          </View>
        }
      />
      <StatusBar backgroundColor="#1d2533" />
      {!isLoading ? (
        <LoadingView />
      ) : (
        <View style={styles.reelViewContainer}>
          <View style={styles.imagesView}>
            <FlatList
              initialNumToRender={10}
              windowSize={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              onEndReachedThreshold={0.1}
              showsVerticalScrollIndicator={false}
              data={reelimages}
              ref={ref => setFlatRef(ref)}
              getItemLayout={getItemLayout}
              renderItem={renderImage}
              keyExtractor={item => item.id}
              onEndReached={() => {
                loadMore();
              }}
              onEndReachedThreshold={0}
              ListFooterComponent={renderFooter}
            />
          </View>
          <View style={styles.thumbnailView}>
            <FlatList
              initialNumToRender={10}
              windowSize={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              onEndReachedThreshold={0.1}
              showsVerticalScrollIndicator={false}
              data={reelimages}
              renderItem={renderThumbnail}
              keyExtractor={item => item.id}
              onEndReached={loadMore}
              onEndReachedThreshold={2}
            />
          </View>
        </View>
      )}
      <Footer navigation={navigation} takePhoto={takePhoto} />
    </View>
  );
}
const LoadingView = () => {
  return (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
};

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
    width: '86%',
    backgroundColor: 'black',
    marginTop: 2,
  },
  thumbnailView: {
    width: '100%',
    backgroundColor: 'black',
    marginTop: 12,
    height: '100%',
  },
  reelViewContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  reelnameText: {
    color: '#d4d4d4',
    fontSize: 16,
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
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
