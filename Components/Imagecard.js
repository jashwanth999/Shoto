import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Octicons, MaterialCommunityIcons} from '../Styles/Icons';
import {TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import {ActivityIndicator} from 'react-native';
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
  act,

  retryUploadCloudImage,
}) {
  const Image = createImageProgress(FastImage);

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

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={goToImageView}
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
    </TouchableOpacity>
  );
}

const Retry = ({
  retryUploadCloudImage,
  act,
  localMediumImage,
  localOriginalImage,
  imageid,
}) => {
  return (
    <View style={styles.retryView}>
      <View style={styles.retry}>
        {act ? (
          <ActivityIndicator color="rgba(200, 200, 200, 0.9)" />
        ) : (
          <MaterialCommunityIcons
            onPress={() => {
              retryUploadCloudImage(
                localMediumImage,
                localOriginalImage,
                imageid,
              );
            }}
            name="cloud-upload-outline"
            color="rgba(200, 200, 200, 0.9)"
            size={31}
            style={{marginBottom: 3}}
          />
        )}
      </View>
    </View>
  );
};
const CommentBadge = ({comments}) => {
  return (
    <View style={styles.commentBadge}>
      <Octicons
        name="comment-discussion"
        color="#d4d4d4"
        size={20}
        onPress={() => {}}
      />
      <Text style={styles.commentsCount}>{comments}</Text>
    </View>
  );
};

const CreatorBadge = ({profilePic, uploaderName, dateTime, d}) => {
  return (
    <View style={styles.creatorBadge}>
      <Avatar
        rounded
        source={{
          uri: profilePic,
        }}
      />
      <View style={styles.userText}>
        <Text style={styles.creatorName}> {uploaderName} </Text>
        <Text style={styles.createdAt}>
          {' '}
          {dateTime.split(' ')[0]} {dateTime.split(' ')[1]}{' '}
          {dateTime.split(' ')[2]} {dateTime.split(' ')[3]}
          {'-'}
          {d}
        </Text>
      </View>
    </View>
  );
};

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
  creatorBadge: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  commentsCount: {
    color: 'rgba(212,212,212,1)',
    marginLeft: 5,
  },
  userText: {
    width: 853,
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'stretch',
    margin: 5,
  },
  creatorName: {
    color: 'rgba(212,212,212,1)',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  createdAt: {
    color: 'rgba(212,212,212,1)',
    fontSize: 10,
    // marginVertical: 2,
  },
  commentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  retry: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    borderRadius: 45,
    justifyContent: 'center',
  },
  retryView: {
    width: '100%',
    height: 'auto',
    aspectRatio: 3 / 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
