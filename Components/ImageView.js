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
import {db} from '../Security/firebase.js';
import {AddComments} from '../actions.js';
import FastImage from 'react-native-fast-image';
export default function ImageView({navigation, route}) {
  const user = useSelector(state => state.user.user);
  const {imageurl, reelid, uploaderid, uploadername, imageid, t} = route.params;
  const commentslist = useSelector(state => state.Comments.comments);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
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
        })
        .then(() => {
          
          //updating comments length at the same time

          db.collection('reels')
            .doc(reelid)
            .collection('reelimages')
            .doc(imageid)
            .update({
              noofcomments: commentslist.length + 1,
            });
        });
    } catch (error) {
      alert('something went wrong check your internet connection');
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
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <ScrollView>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('Photoview', {
              imageurl: imageurl,
            })
          }>
          <FastImage style={styles.backgroundImage} source={{uri: imageurl}} />
        </TouchableOpacity>

        <View style={{width: '100%', alignItems: 'center', marginTop: 15}}>
          <View
            style={{
              width: 140,
              height: 5,
              backgroundColor: 'grey',
              borderRadius: 40,
            }}></View>
        </View>
        <View style={styles.titleview}>
          <Text style={{color: '#D7DBDD', fontSize: 16}}>{uploadername}</Text>
          <Text style={{color: '#D7DBDD', fontSize: 16}}>
            {' '}
            {t.split(' ')[1]} {t.split(' ')[2]} {t.split(' ')[3]}{' '}
            {t.split(' ')[4]}
          </Text>
        </View>
        <TextInput
          value={comment}
          onChangeText={text => setComment(text)}
          placeholder="write something about pic"
          placeholderTextColor="grey"
          onSubmitEditing={!comment ? () => {} : submitcomment}
          style={styles.textinput}
        />
        {commentslist !== null ? (
          commentslist.map(({id, comments}) => (
            <Comments
              key={id}
              url={comments.commentbyprofilepic}
              name={comments.commentbyname}
              comment={comments.comment}
            />
          ))
        ) : (
          <ActivityIndicator
            size="small"
            color="white"
            style={{marginTop: 10}}
          />
        )}
      </ScrollView>
      <View style={styles.backbuttoniconview}>
        <Ionicons
          onPress={() => {
            dispatch(AddComments(null));
            navigation.goBack();
          }}
          name="md-chevron-back-circle-outline"
          color="white"
          style={{marginLeft: 3}}
          size={35}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    height: 380,
  },
  backbuttoniconview: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
    alignContent: 'center',
  },
  titleview: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
  textinput: {
    backgroundColor: 'black',
    padding: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: '#D7DBDD',
    marginLeft: 10,
    marginRight: 10,
    color: 'white',
  },
});
