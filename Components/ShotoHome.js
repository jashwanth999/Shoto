import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
} from 'react-native';
import {Header, Avatar} from 'react-native-elements';
import Reellist from './Reellist.js';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons, MaterialIcons} from '../Styles/Icons.js';
import {Addreel, Adduser, reelNameAction} from '../actions.js';
import {useFocusEffect} from '@react-navigation/native';
import Footer from '../Screens/Footer.js';
import firestore from '@react-native-firebase/firestore';
import StartingHomePage from './StartingHomePage.js';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function ShotoHome({navigation}) {
  const dispatch = useDispatch();
  const db = firestore();

  const [isLoading, setisLoading] = useState(false);

  const [isSearch, setIsSearch] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const user = useSelector(state => state.user.user);

  const reels = useSelector(state => state.reels.reellist);

  const [startAfter, setStartAfter] = useState(null);

  const [LastPosition, setLastPosition] = useState(false);

  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');
  const fetchReelList = async () => {
    try {
      return await db
        .collection('user_reels')
        .doc(user.email)
        .collection('reellist')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();
    } catch (error) {}
  };
  const fetchReelListMore = async () => {
    try {
      return await db
        .collection('user_reels')
        .doc(user.email)
        .collection('reellist')
        .orderBy('timestamp', 'desc')
        .startAfter(startAfter)
        .limit(5)
        .get();
    } catch (error) {}
  };
  // Scroll Down to refresh
  useEffect(() => {
    const unsubscribe = db
      .collection('user_reels')
      .doc(user?.email)
      .collection('reellist')
      .onSnapshot(snapshot => {
        dispatch(
          reelNameAction(
            snapshot.docs.map(doc => doc.data()?.reelname.toLowerCase()),
          ),
        );
      });
    return unsubscribe;
  }, [user?.email]);
  const changed = useSelector(state => state.changed.changed);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLastPosition(false);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // get the current user  details

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .doc(user?.email)
      .onSnapshot({includeMetadataChanges: true}, doc => {
        dispatch(Adduser(doc.data()));
      });
    return unsubscribe;
  }, [user?.email]);

  //load more reels on scroll end

  // navigation go back lock

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  // get Reellist of user and dispatch it

  // get first five reels
  useEffect(() => {
    let mounted = true;
    if (mounted && user) {
      fetchReelList().then(snapshot => {
        const lastdata = snapshot.docs[snapshot.docs.length - 1];
        snapshot.docs.length < 5
          ? setLastPosition(true)
          : setLastPosition(false);
        setStartAfter(lastdata);
        setisLoading(true);
        dispatch(
          Addreel(
            snapshot.docs.map(doc => ({
              id: doc.id,
              reellist: doc.data(),
            })),
          ),
        );
        setData(
          snapshot.docs.map(doc => ({
            id: doc.id,
            reellist: doc.data(),
          })),
        );
      });
    }
    return () => {
      mounted = false;
    };
  }, [refreshing, changed, user?.email]);

  useEffect(() => {
    if (user?.email) {
      const unsubscribe = db
        .collection('user_reels')
        .doc(user.email)
        .collection('reellist')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .onSnapshot({includeMetadataChanges: true}, snapshot => {});
      return unsubscribe;
    }
  }, [user?.email]);

  const loadMoreReels = () => {
    if (user?.email && startAfter) {
      fetchReelListMore().then(snapshot => {
        if (snapshot) {
          snapshot.docs.length < 5
            ? setLastPosition(true)
            : setLastPosition(false);
          const lastdata = snapshot.docs[snapshot.docs.length - 1];
          setStartAfter(lastdata);

          dispatch(
            Addreel([
              ...reels,
              ...snapshot.docs.map(doc => ({
                id: doc.id,
                reellist: doc.data(),
              })),
            ]),
          );
          setData([
            ...data,
            ...snapshot.docs.map(doc => ({
              id: doc.id,
              reellist: doc.data(),
            })),
          ]);
        }
      });
    }
  };
  const renderReels = useCallback(({item, index}) => {
    if (item.reellist?.reelname.toLowerCase().includes(search.toLowerCase())) {
      return (
        <Reellist
          id={item.id}
          name={item.reellist?.reelname}
          navigation={navigation}
          t={new Date(item.reellist?.timestamp?.seconds * 1000).toUTCString()}
        />
      );
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : -100}
      enabled={Platform.OS === 'ios' ? true : false}
      enabled
      style={styles.container}>
      {!isSearch ? (
        //  main Header
        <Header
          containerStyle={{
            backgroundColor: '#1d2533',
            borderBottomColor: 'none',
            height: 90,
          }}
          leftComponent={<Avatar rounded source={{uri: user?.profilepic}} />}
          centerComponent={
            <View style={styles.headerView}>
              <Text
                style={{
                  color: '#d4d4d4',
                  fontSize: 16,
                  paddingTop: 10,
                  fontWeight: 'bold',
                }}>
                Shoto.Click
              </Text>
            </View>
          }
          rightComponent={
            <MaterialIcons
              onPress={() => {
                setIsSearch(!isSearch);
              }}
              name="search"
              style={{marginTop: 4}}
              color="white"
              size={26}
            />
          }
        />
      ) : (
        // search header
        <Header
          containerStyle={{
            backgroundColor: '#1d2533',
            borderBottomColor: 'none',
            height: 90,
          }}
          placement="left"
          centerComponent={
            <View style={styles.searchView}>
              <TextInput
                value={search}
                onChangeText={text => setSearch(text)}
                placeholderTextColor="grey"
                style={styles.textinput}
                placeholder="Type Here"
              />
              <Ionicons
                onPress={() => {
                  setIsSearch(!isSearch);
                  setSearch('');
                }}
                style={{paddingRight: 5}}
                name="ios-close-outline"
                color="#d4d4d4"
                size={21}
              />
            </View>
          }
        />
      )}

      <StatusBar backgroundColor="#1d2533" />

      {isLoading ? (
        reels?.length === 0 ? (
          <StartingHomePage />
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={reels}
              initialNumToRender={5}
              onRefresh={onRefresh}
              refreshing={refreshing}
              renderItem={renderReels}
              keyExtractor={item => item.id}
              onEndReached={loadMoreReels}
              onEndReachedThreshold={5}
              ListFooterComponent={
                !LastPosition && <ActivityIndicator color="grey" size="small" />
              }
              scrollEventThrottle={150}
            />
          </View>
        )
      ) : (
        <Loading />
      )}

      <Footer navigation={navigation} />
    </KeyboardAvoidingView>
  );
}
const Loading = () => {
  return (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'black',
    flex: 1,
  },
  textinput: {
    width: '90%',
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 16,
    color: 'white',
    paddingBottom: 5,
  },
  searchView: {
    height: 35,
    width: '100%',
    borderWidth: 1,
    borderColor: 'grey',
    flexDirection: 'row',
    borderRadius: 15,
    alignItems: 'center',
  },
  headerView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
