import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Octicons } from '../Styles/Icons';
import { TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
export default function imagecard({
  navigation,
  uploadername,
  reelid,
  imageid,
  uploaderid,
  useremail,
  comments,
  t,
  url,
  profilepic,
  time,
  containerStyle
}) {

  const Image = createImageProgress(FastImage);

  const goToImageView = () => {
    navigation.navigate('ImageView', {
      reelid: reelid,
      imageurl: url,
      uploadername: uploadername,
      uploaderid: uploaderid,
      imageid: imageid,
      useremail: useremail,
      t: t,
    })
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={goToImageView}
      >
        <Image
          indicator={ProgressBar} 
          indicatorProps={{
            size: 40,
            borderWidth: 0,
            color: "rgba(36, 123, 160, 1)",
            unfilledColor: 'rgba(36, 123, 160, 0.2)',
          }}
          resizeMode="cover"
          style={styles.image}
          source={{
            uri: url,
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

    </View>
  );
}

const CardImage = () => {

}

const CommentBadge = ({ comments }) => {
  return (
    <View style={styles.commentBadge}>
      <Octicons
        name="comment-discussion"
        color="#d4d4d4"
        size={20}
        onPress={() => { }}
      />
      <Text style={styles.commentsCount}>
        {comments}
      </Text>
    </View>
  )
}

const CreatorBadge = ({ profilePic, uploaderName, dateTime, time }) => {
  return (
    <View style={styles.creatorBadge}>
      <Avatar
        rounded
        source={{
          uri: profilePic
            ? profilePic
            : 'https://res.cloudinary.com/jashwanth/image/upload/v1624182501/60111_nihqdw.jpg',
        }}
      />
      <View style={styles.userText}>
        <Text style={styles.creatorName}> {uploaderName} </Text>
        <Text style={styles.createdAt}> {dateTime === 'Invalid Date' ? time : dateTime} </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(18,18,18,1)",
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
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  creatorBadge: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  commentsCount: {
    color: "rgba(212,212,212,1)",
    marginLeft: 5
  },
  userText: {
    width: 853,
    alignItems: "flex-start",
    justifyContent: "center",
    alignSelf: "stretch",
    margin: 5
  },
  creatorName: {
    color: "rgba(212,212,212,1)",
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    marginVertical: 2,
  },
  createdAt: {
    color: "rgba(212,212,212,1)",
    fontSize: 10,
    // marginVertical: 2,
  },
  commentBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
