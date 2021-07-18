import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import {RNS3} from 'react-native-aws3';
import {useSelector} from 'react-redux';
import * as Sentry from '@sentry/react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Retry from './ImageCardComponents.js/Retry';
import CreatorBadge from './ImageCardComponents.js/CreatorBadge';
import CommentBadge from './ImageCardComponents.js/CommentBadge';
import Remove from './ImageCardComponents.js/Remove';
export default function imagecard({
  navigation,
  uploadername,
  reelid,
  imageid,
  useremail,
  comments,
  t,
  cloudMediumImage,
  profilepic,
  d,
  containerStyle,
  localMediumImage,
  isUploadedMedium,
  localOriginalImage,
  cloudOriginalImage,
  uploaderid,
  SnackBarComponent,
  removeFromReel,
  deletePermanently,
}) {
  const Image = createImageProgress(FastImage);
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const [act, setAct] = useState(false);
  const user = useSelector(state => state.user.user);
  const reeldata = useSelector(state => state.reeldata.reeldata);
  const currentUser = auth().currentUser;
  const db = firestore();
  const goToImageView = () => {
    navigation.navigate('ImageView', {
      reelid: reelid,
      imageurl: isUploadedMedium ? cloudMediumImage : localMediumImage,
      uploadername: uploadername,
      uploaderid: uploaderid,
      imageid: imageid,
      useremail: useremail,
      t: t,
      cloudOriginalImage: isUploadedMedium
        ? cloudOriginalImage
        : localOriginalImage,
      d: d,
    });
  };
  const retryUploadCloudImage = () => {
    setAct(true);
    const mediumImageFile = {
      uri: localMediumImage,
      name: localMediumImage?.replace(/^.*[\\\/]/, ''),
      type: 'image/png',
    };
    const originalImageFile = {
      uri: localOriginalImage,
      name: localOriginalImage?.replace(/^.*[\\\/]/, ''),
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
          setAct(false);
          SnackBarComponent('Please check your internet connection and retry');
        } else {
          try {
            uploadToS3Ref.update({
              cloudMediumImage: response.body.postResponse.location,
              isUploadedMedium: true,
            });
            uploadS3ToUserReels.set({
              cloudOriginalImage: response.body.postResponse.location,
            });
            setAct(false);
          } catch (error) {
            uploadToS3Ref.update({
              cloudMediumImage: '',
              isUploadedMedium: false,
            });
            setAct(false);
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
        setAct(false);
        Sentry.captureException(error.message);
        SnackBarComponent('Please check your internet connection and retry');
      });

    //Uploading Original Image
    RNS3.put(originalImageFile, optionsForOriginal)
      .then(response => {
        if (response.status !== 201) {
          alert('Some error occurred');
          SnackBarComponent('Please check your internet connection and retry');
          setAct(false);
        } else {
          try {
            uploadToS3Ref.update({
              cloudOriginalImage: response.body.postResponse.location,
              isUploadOriginal: true,
            });

            setAct(false);
          } catch (error) {
            uploadToS3Ref.update({
              cloudOriginalImage: '',
              isUploadOriginal: false,
            });
            setAct(false);
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
        setAct(false);
        Sentry.captureException(error.message);
        SnackBarComponent('Please check your internet connection and retry');
      });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={goToImageView}
      onLongPress={toggleOverlay}
      style={[styles.container, containerStyle]}>
      <View>
        <Image
          indicator={ProgressBar}
          indicatorProps={{
            size: 40,
            borderWidth: 0,
            color: 'rgba(36, 123, 160, 1)',
            unfilledColor: 'rgba(36, 123, 160, 0.2)',
          }}
          resizeMode="cover"
          style={styles.image}
          source={{
            uri: isUploadedMedium ? cloudMediumImage : localMediumImage,
          }}
        />
      </View>

      <View style={styles.cardInfo}>
        <CreatorBadge
          profilePic={profilepic}
          uploaderName={uploadername}
          dateTime={t}
          d={d}
        />
        <CommentBadge comments={comments} />
      </View>
      {cloudMediumImage === '' ||
      (isUploadedMedium === false && !cloudMediumImage) ? (
        <Retry
          retryUploadCloudImage={retryUploadCloudImage}
          act={act}
          localMediumImage={localMediumImage}
          localOriginalImage={localOriginalImage}
          imageid={imageid}
        />
      ) : (
        <View />
      )}
      <Remove
        visible={visible}
        toggleOverlay={toggleOverlay}
        imageid={imageid}
        removeFromReel={removeFromReel}
        deletePermanently={deletePermanently}
        uploaderid={uploaderid}
        user={user}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(18,18,18,1)',
    borderRadius: 5,
    overflow: 'hidden',
    margin: 10,
  },
  image: {
    width: '100%',
    height: 'auto',
    aspectRatio: 3 / 2,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
