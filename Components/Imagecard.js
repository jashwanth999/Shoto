import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Octicons, MaterialCommunityIcons} from '../Styles/Icons';
import {TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import {ActivityIndicator} from 'react-native';
import {RNS3} from 'react-native-aws3';
export default function imagecard({
  navigation,
  uploadername,
  reelid,
  imageid,
  uploaderid,
  useremail,
  comments,
  t,
  s3url,
  profilepic,
  time,
  containerStyle,
  localimage,
  isUploaded,
  options,
  db,
}) {
  const Image = createImageProgress(FastImage);
  const [act, setAct] = useState(false);

  const file = {
    uri: localimage,
    name: localimage.replace(/^.*[\\\/]/, ''),
    type: 'image/png',
  };

  const goToImageView = () => {
    navigation.navigate('ImageView', {
      reelid: reelid,
      imageurl: isUploaded ? s3url : localimage,
      uploadername: uploadername,
      uploaderid: uploaderid,
      imageid: imageid,
      useremail: useremail,
      t: t,
    });
  };
  const retryUpload = () => {
    setAct(true);
    let uploadToS3Ref = db
      .collection('reels')
      .doc(reelid)
      .collection('reelimages')
      .doc(imageid);
    RNS3.put(file, options)
      .then(response => {
        if (response.status !== 201) {
          alert('Some error occurred');
          setAct(false);
        } else {
          try {
            uploadToS3Ref.update({
              s3url: response.body.postResponse.location,
              isUploaded: true,
            });
            setAct(false);
          } catch (error) {
            uploadToS3Ref.update({
              s3url: '',
              isUploaded: false,
            });
            setAct(false);
          }
        }
      })
      .catch(error => {
        uploadToS3Ref.update({
          s3url: '',
          isUploaded: false,
        });
        alert('please check your internet connection or retry');
        setAct(false);
      });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity activeOpacity={0.8} onPress={goToImageView}>
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
            uri: isUploaded ? s3url : localimage,
          }}
        />
      </TouchableOpacity>

      <View style={styles.cardInfo}>
        <CreatorBadge
          profilePic={profilepic}
          uploaderName={uploadername}
          dateTime={t}
          time={time}
        />
        <CommentBadge comments={comments} />
      </View>
      {s3url === '' || (isUploaded === false && !s3url) ? (
        <Retry retryUpload={retryUpload} act={act} />
      ) : (
        <View />
      )}
    </View>
  );
}

const Retry = ({retryUpload, act}) => {
  return (
    <View style={styles.retry}>
      {act ? (
        <ActivityIndicator color="rgba(200, 200, 200, 0.9)" />
      ) : (
        <MaterialCommunityIcons
          onPress={retryUpload}
          name="cloud-upload-outline"
          color="rgba(200, 200, 200, 0.9)"
          size={28}
          style={{marginBottom: 3}}
        />
      )}
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

const CreatorBadge = ({profilePic, uploaderName, dateTime, time}) => {
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
          {dateTime === 'Invalid Date' ? time : dateTime}{' '}
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
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
  },
});
