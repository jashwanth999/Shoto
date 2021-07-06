import React, {useState, useEffect, useRef} from 'react';
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
import {db, auth} from '../Security/firebase.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Addreel, Addreelupdate, Adduser, reelNameAction} from '../actions.js';
import {useFocusEffect} from '@react-navigation/native';
import Footer from '../Screens/Footer.js';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function ShotoHome({navigation}) {
  const dispatch = useDispatch();

  GoogleSignin.configure({
    scopes: [], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '821295087358-f7nsmu3rup0ghfflnvk7ret61mv49gec.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });

  const [isLoading, setisLoading] = useState(false);

  const [isSearch, setIsSearch] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const user = useSelector(state => state.user.user);
  const reels = useSelector(state => state.reels.reellist);
  const changed = useSelector(state => state.changed.changed);
  const [startAfter, setStartAfter] = useState(null);
  const [LastPosition, setLastPosition] = useState(false);

  const [spinner, setSpinner] = useState(false);

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  // Scroll Down to refresh

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
      .onSnapshot(doc => dispatch(Adduser(doc.data())));
    return unsubscribe;
  }, [user?.email]);

  // get Reellist of user and dispatch it

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
          reelNameAction(
            snapshot.docs.map(doc => doc.data()?.reelname.toLowerCase()),
          ),
        );
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

  // navigation go back lock fc:44:d6:16:b4:d0:f6:c7:0a:a4:fe:8d:15:7a:eb:1a:36:cd:d4:97


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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : -100}
      enabled={Platform.OS === 'ios' ? true : false}
      enabled
      style={styles.container}>
      {!isSearch ? (
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
      {isLoading && reels ? (
        <View style={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            initialNumToRender={5}
            renderItem={({item}) =>
              item.reellist?.reelname
                .toLowerCase()
                .includes(search.toLowerCase()) ? (
                <Reellist
                  id={item.id}
                  name={item.reellist?.reelname}
                  navigation={navigation}
                  t={new Date(
                    item.reellist?.timestamp.seconds * 1000,
                  ).toUTCString()}
                />
              ) : (
                <View></View>
              )
            }
            keyExtractor={item => item.id}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={() => {
              setSpinner(true);
              fetchReelListMore().then(snapshot => {
                if (snapshot && !LastPosition) {
                  snapshot.docs.length < 5
                    ? setLastPosition(true)
                    : setLastPosition(false);
                  const lastdata = snapshot.docs[snapshot.docs.length - 1];
                  setStartAfter(lastdata);
                  setisLoading(true);
                  setSpinner(false);
                  dispatch(
                    reelNameAction(
                      snapshot.docs.map(doc =>
                        doc.data()?.reelname.toLowerCase(),
                      ),
                    ),
                  );
                  dispatch(
                    Addreelupdate(
                      snapshot.docs.map(doc => ({
                        id: doc.id,
                        reellist: doc.data(),
                      })),
                    ),
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
            }}
            onEndReachedThreshold={5}
            ListFooterComponent={
              !LastPosition && <ActivityIndicator color="grey" size="small" />
            }
            scrollEventThrottle={150}
          />
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      )}
      <Footer navigation={navigation} />
    </KeyboardAvoidingView>
  );
}
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
});
