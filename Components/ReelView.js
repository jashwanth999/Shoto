import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  BackHandler,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Ionicons} from '../Styles/Icons.js';
import Imagecard from './Imagecard.js';
import Thumbnail from './Thumbnail.js';
import {useSelector, useDispatch} from 'react-redux';
import {
  Addreelimages,
  clearScrollData,
  setindex,
  updateReelImages,
} from '../actions.js';
import {db} from '../Security/firebase.js';
import * as FileSystem from 'expo-file-system';
import Footer2 from '../Screens/Footer2.js';
import {useFocusEffect} from '@react-navigation/native';

export default function ReelView({navigation}) {
  let onEndReacheMomentum = false;
  const [flatRef, setFlatRef] = useState();
  const dispatch = useDispatch();
  const [lastPosition, setLastPosition] = useState(false);
  const [startAfter, setstartAfter] = useState(null);
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const trigger = useSelector(state => state.searchTrigger.searchHeader);

  // android back button goes to home screen

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

  // get images of reels stored in reducers

  const reelimages = useSelector(state => state.reellistimages.reellistimages);

  // get details of reels stored in reducers

  const reeldata = useSelector(state => state.reeldata.reeldata);

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

        dispatch(
          Addreelimages(
            snapshot.docs.map(doc => ({
              id: doc.id,
              reelimages: doc.data(),
              localimage: FileSystem.documentDirectory + doc.id + '.jpg',
            })),
          ),
        );
        setData(
          snapshot.docs.map(doc => ({
            id: doc.id,
            reelimages: doc.data(),
            localimage: FileSystem.documentDirectory + doc.id + '.jpg',
          })),
        );
      });

    return unsubscribe;
  }, [reeldata.reelid]);

  const getItemLayout = (data, index) => {
    if (index === -1) return {index, length: 0, offset: 0};
    return {length: 330, offset: 330 * index, index};
  };

  // scroll to image card ref

  const indexscroll = () => {
    flatRef?.scrollToIndex({index: yof, animated: true});
  };
  useEffect(() => {
    indexscroll();
  }, [yof]);
  const renderImage = useCallback(({item, index}) => {
    return (
      <Imagecard
        index={index}
        url={item.reelimages?.imageurl}
        comments={
          item.reelimages?.noofcomments ? item.reelimages.noofcomments : 0
        }
        imageid={item.id}
        uploaderid={item.reelimages?.uploadedby}
        reelid={reeldata.reelid}
        navigation={navigation}
        t={new Date(item.reelimages?.timestamp.seconds * 1000).toUTCString()}
        uploadername={item.reelimages?.uploadername}
        useremail={reeldata.useremail}
        profilepic={item.reelimages?.uploaderpropic}
        trigger={trigger}
      />
    );
  }, []);
  const renderThumbnail = useCallback(({item, index}) => {
    return (
      <Thumbnail
        url={item.reelimages?.imageurl}
        index={index}
        localimage={item.localimage}
        trigger={trigger}
      />
    );
  }, []);
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
                  localimage: FileSystem.documentDirectory + doc.id + '.jpg',
                })),
              ]),
            );

            setData([
              ...data,
              ...snapshot.docs.map(doc => ({
                id: doc.id,
                reelimages: doc.data(),
                localimage: FileSystem.documentDirectory + doc.id + '.jpg',
              })),
            ]);
          }
        });
      return unsubscribe;
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'rgba(14,14,14,1)'}}>
      <Header
        containerStyle={{
          backgroundColor: '#1d2533',
          borderBottomColor: 'none',
          height: 90,
        }}
        leftComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Shotohome');
              dispatch(clearScrollData());
              dispatch(setindex(0));
              dispatch(Addreelimages(null));
            }}
            style={{display: 'flex', flexDirection: 'row', marginTop: 4}}>
            <Ionicons name="chevron-back" color="#d4d4d4" size={21} />
            <Text style={{color: '#d4d4d4', fontSize: 15}}>Home</Text>
          </TouchableOpacity>
        }
        centerComponent={
          <View style={styles.headernamecontainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{color: '#d4d4d4', fontSize: 16}}>
              {reeldata.reelname}
            </Text>
          </View>
        }
      />
      <StatusBar backgroundColor="#1d2533" />
      {reelimages === null ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      ) : (
        <View style={{display: 'flex', flexDirection: 'row', flex: 1}}>
          <View style={styles.imagesview}>
            <FlatList
              initialNumToRender={10}
              windowSize={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              onEndReachedThreshold={0.1}
              showsVerticalScrollIndicator={false}
              data={data}
              ref={ref => setFlatRef(ref)}
              getItemLayout={getItemLayout}
              renderItem={renderImage}
              keyExtractor={item => item.id}
              onEndReached={() => {
                if (!onEndReacheMomentum && !lastPosition) {
                  loadMore();
                  onEndReacheMomentum = true;
                }
              }}
              onEndReachedThreshold={0}
              ListFooterComponent={renderFooter}
              onMomentumScrollBegin={() => {
                onEndReacheMomentum = false;
              }}
            />
          </View>
          <View style={styles.thumbnailview}>
            <FlatList
              initialNumToRender={10}
              windowSize={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              onEndReachedThreshold={0.1}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={renderThumbnail}
              keyExtractor={item => item.id}
              onEndReached={loadMore}
              onEndReachedThreshold={2}
            />
          </View>
        </View>
      )}
      <Footer2 navigation={navigation} />
    </View>
  );
}
const styles = StyleSheet.create({
  headernamecontainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 4,
    marginTop: 4,
  },
  imagesview: {
    width: '86%',
    backgroundColor: 'black',
    marginTop: 2,
  },
  thumbnailview: {
    width: '100%',
    backgroundColor: 'black',
    marginTop: 12,
    height: '100%',
  },
  addnewreelbutton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
});
