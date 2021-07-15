import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Comments from './Comments.js';
import {Ionicons} from '../Styles/Icons.js';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {AddComments} from '../actions.js';
import FastImage from 'react-native-fast-image';
import * as Sentry from '@sentry/react-native';
export default function ImageView({navigation, route}) {
  const user = useSelector(state => state.user.user);
  const {
    imageurl,
    reelid,
    uploaderid,
    uploadername,
    imageid,
    t,
    cloudOriginalImage,
    d,
  } = route.params;
  const commentsList = useSelector(state => state.Comments.comments);
  const db = firestore();
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  

  const submitcomment = () => {
    // sending comments to images which stored in reels -> reelimages
    try {
      db.collection('reels')
        .doc(reelid)
        .collection('reelimages')
        .doc(imageid)
        .collection('comments')
        .add({
          comment: comment,
          commentbyemail: user.email,
          commentbyname: user.username,
          commentbyprofilepic: user.profilepic,
          imageuploaderid: uploaderid,
          imageuploadername: uploadername,
          timestamp: new Date(),
        });
      //updating comments length at the same time
      db.collection('reels')
        .doc(reelid)
        .collection('reelimages')
        .doc(imageid)
        .update({
          noofcomments: commentsList.length + 1,
        });
    } catch (error) {
      Sentry.captureMessage(error);
      
    }
    setComment('');
  };

  // get comments from firestore

  useEffect(() => {
    const unsubscribe = db
      .collection('reels')
      .doc(reelid)
      .collection('reelimages')
      .doc(imageid)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setIsLoading(true);
        dispatch(
          AddComments(
            snapshot.docs.map(doc => ({
              id: doc.id,
              comments: doc.data(),
            })),
          ),
        );
      });
    return unsubscribe;
  }, [reelid, imageid]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('Photoview', {
              imageurl: imageurl,
              cloudOriginalImage: cloudOriginalImage,
            })
          }>
          <FastImage style={styles.backgroundImage} source={{uri: imageurl}} />
        </TouchableOpacity>
        <Divider />
        <TitleView uploadername={uploadername} t={t} d={d} />
        <TextInput
          value={comment}
          onChangeText={text => setComment(text)}
          placeholder="write something about pic"
          placeholderTextColor="grey"
          onSubmitEditing={!comment ? () => {} : submitcomment}
          style={styles.textInput}
        />
        {isLoading ? (
          commentsList.map(({id, comments}) => (
            <Comments
              key={id}
              url={comments.commentbyprofilepic}
              name={comments.commentbyname}
              comment={comments.comment}
            />
          ))
        ) : (
          <LoadingView />
        )}
      </ScrollView>
      <BackButton navigation={navigation} />
    </View>
  );
}
const TitleView = ({uploadername, t, d}) => {
  return (
    <View style={styles.titleView}>
      <Text style={styles.uploaderNameText}>{uploadername}</Text>
      <Text style={styles.date}>
        {' '}
        {t.split(' ')[1]} {t.split(' ')[2]} {t.split(' ')[3]} {d}
      </Text>
    </View>
  );
};
const BackButton = ({navigation}) => {
  return (
    <View style={styles.backButtonView}>
      <Ionicons
        onPress={() => {
          navigation.goBack();
        }}
        name="md-chevron-back-circle-outline"
        color="white"
        style={{marginLeft: 3}}
        size={35}
      />
    </View>
  );
};
const Divider = () => {
  return (
    <View style={styles.dividerView}>
      <View style={styles.divider}></View>
    </View>
  );
};
const LoadingView = () => {
  return (
    <ActivityIndicator size="small" color="white" style={{marginTop: 10}} />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundImage: {
    height: 380,
  },
  backButtonView: {
    position: 'absolute',
    top: 45,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
    alignContent: 'center',
  },
  titleView: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
  textInput: {
    backgroundColor: 'black',
    padding: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: '#D7DBDD',
    marginLeft: 10,
    marginRight: 10,
    color: 'white',
  },
  uploaderNameText: {
    color: '#D7DBDD',
    fontSize: 16,
  },
  date: {
    color: '#D7DBDD',
    fontSize: 13,
  },
  dividerView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  divider: {
    width: 140,
    height: 5,
    backgroundColor: 'grey',
    borderRadius: 40,
  },
});
