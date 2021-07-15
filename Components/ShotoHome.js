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
  TouchableOpacity,
} from 'react-native';
import {Header, Avatar} from 'react-native-elements';
import Reellist from './Reellist.js';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons, MaterialIcons} from '../Styles/Icons.js';
import {
  Addreel,
  Addreeldata,
  Adduser,
  reelNameAction,
  setChange,
  setindex,
} from '../actions.js';
import {useFocusEffect} from '@react-navigation/native';
import Footer from '../Screens/Footer.js';
import firestore from '@react-native-firebase/firestore';
import StartingHomePage from './StartingHomePage.js';
import ImagePicker from 'react-native-image-crop-picker';
import {Overlay} from 'react-native-elements';
import ImageResizer from 'react-native-image-resizer';
import Snackbar from 'react-native-snackbar';
import * as Sentry from '@sentry/react-native';
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
          ClickaPic={ClickaPic}
          setReel={setReel}
        />
      );
    }
  });

  //  list of all reel names of a user

  const reelnames = useSelector(state => state.reelnames.Reelnames);

  const [visible, setVisible] = useState(false);

  const [reelname, setreelname] = useState(''); // text input value

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const addReel = () => {
    // checking whether the reelname is previously used or not

    if (!reelnames.includes(reelname.toLowerCase())) {
      try {
        navigation.navigate('Adduserlist');
        toggleOverlay();
        const data = {
          reelname: reelname,
          timestamp: new Date(),
        };
        let uploadNewReel = db
          .collection('user_reels')
          .doc(user.email)
          .collection('reellist')
          .doc();
        uploadNewReel.set(data);
        let reelid = uploadNewReel.id;
        dispatch(
          Addreeldata({
            useremail: user.email,
            reelname: reelname,
            reelid: reelid,
            username: user.username,
          }),
        );
        db.collection('reels').doc(reelid).set({
          created_useremail: user.email,
          reelname: reelname,
          created_at: new Date(),
        });
        db.collection('reels')
          .doc(reelid)
          .collection('reelusers')
          .doc(user.email)
          .set({
            useremail: user.email,
            reelid: reelid,
            timestamp: new Date(),
            profilepic: user.profilepic,
          });
        dispatch(setChange(!changed));
      } catch (error) {
        toggleOverlay();
        Sentry.captureMessage(error);
      }
    } else {
      // if reelname already exist it alerts

      alert('Reelname already exist please change the reelname');
    }
    setreelname('');
  };

  // take photo it navigates to save image screen

  const takePhoto = async () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
    })
      .then(image => {
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
            //console.log(response);
            navigation.navigate('selectimagescreen', {
              mediumImage: response.uri,
              originalImage: image.path,
              mediumImageName: response.name,
              originalImageName: image.path.replace(/^.*[\\\/]/, ''),
            });

            dispatch(setindex(0));
          })
          .catch(error => {
            SnackBarComponent('Photo not uploaded please retry');
          });
      })
      .catch(err => {
        // Here you handle if the user cancels or any other errors
        console.log('cancelled');
      });
  };
  const ClickaPic = (name, id) => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
    }).then(image => {
      dispatch(
        Addreeldata({
          reelname: name,
          reelid: id,
        }),
      );
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
          //console.log(response);
          navigation.navigate('ReelView', {
            mediumImage: response.uri,
            originalImage: image.path,
            mediumImageName: response.name,
            originalImageName: image.path.replace(/^.*[\\\/]/, ''),
          });

          dispatch(setindex(0));
        })
        .catch(error => {
          SnackBarComponent('Photo not uploaded please retry');
        });
    });
  };
  const setReel = (name, id) => {
    // set reel details to reducers
    dispatch(
      Addreeldata({
        reelname: name,
        reelid: id,
      }),
    );
    // navigating to reelview
    navigation.navigate('ReelView', {
      mediumImage: '',
      originalImage: '',
      mediumImageName: '',
      originalImageName: '',
    });
  };
  const SnackBarComponent = message => {
    return Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

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
                style={styles.searchInput}
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
      <Footer
        navigation={navigation}
        addReel={addReel}
        takePhoto={takePhoto}
        toggleOverlay={toggleOverlay}
        page="home"
      />
      <Modal
        visible={visible}
        toggleOverlay={toggleOverlay}
        addReel={addReel}
        setreelname={setreelname}
        reelname={reelname}
      />
    </KeyboardAvoidingView>
  );
}
const SearchHeader = props => {
  return (
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
            value={props.search}
            onChangeText={text => props.setSearch(text)}
            placeholderTextColor="grey"
            style={styles.searchInput}
            placeholder="Type Here"
          />
          <Ionicons
            onPress={() => {
              props.setIsSearch(!props.isSearch);
              props.setSearch('');
            }}
            style={{paddingRight: 5}}
            name="ios-close-outline"
            color="#d4d4d4"
            size={21}
          />
        </View>
      }
    />
  );
};
const MainHeader = props => {
  return (
    <Header
      containerStyle={{
        backgroundColor: '#1d2533',
        borderBottomColor: 'none',
        height: 90,
      }}
      leftComponent={<Avatar rounded source={{uri: props.profilepic}} />}
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
            props.setIsSearch(!props.isSearch);
          }}
          name="search"
          style={{marginTop: 4}}
          color="white"
          size={26}
        />
      }
    />
  );
};
const Modal = props => {
  return (
    <Overlay
      isVisible={props.visible}
      overlayStyle={{backgroundColor: '#1d2533', borderRadius: 10}}
      onBackdropPress={props.toggleOverlay}
      backdropStyle={{backgroundColor: 'rgba( 0, 0, 0, 0.8)'}}>
      <View style={styles.addreelnamecontainer}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text style={styles.createnewthread}>New Reel !</Text>
        </View>
        <View style={{marginTop: 4, marginLeft: 4}}>
          <Text style={styles.whatshouldwenameit}>
            What should we name it ?
          </Text>
          <TextInput
            value={props.reelname}
            placeholderTextColor="grey"
            onChangeText={text => props.setreelname(text)}
            style={styles.textinput}
            placeholder="Getaway with friends"
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButtonsContainer}
            onPress={props.toggleOverlay}>
            <Text style={styles.footertext}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButtonsContainer}
            onPress={!props.reelname ? () => {} : props.addReel}>
            <Text style={styles.footertext}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};
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
  searchInput: {
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
  modalContainer: {
    backgroundColor: '#1d2533',
    borderColor: '#262626',
    borderTopWidth: 0.25,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fotterView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    color: '#d4d4d4',
    fontSize: 13,
  },
  middleIcon: {
    width: 60,
    height: 60,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d2533',
    marginBottom: 50,
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.2,
    elevation: 2,
    minWidth: 40,
    minHeight: 40,
    borderWidth: 0.2,
    borderColor: '#d4d4d4',
  },
  addreelnamecontainer: {
    height: 200,
    width: 290,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1d2533',
    paddingTop: 15,
    justifyContent: 'space-between',
  },
  createnewthread: {
    fontSize: 20,
    color: '#d4d4d4',
    marginTop: 10,
  },
  whatshouldwenameit: {
    color: '#d4d4d4',
    fontSize: 14,
  },
  textinput: {
    padding: 2,
    borderRadius: 5,
    width: '95%',
    fontSize: 16,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    color: '#d4d4d4',
    marginTop: 4,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingBottom: 15,
  },
  footertext: {
    fontSize: 15,
    color: '#d4d4d4',
  },
  actcontainer: {
    height: 200,
    width: 290,
    display: 'flex',
    backgroundColor: '#1d2533',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonsContainer: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 3,
    width: '40%',
    alignItems: 'center',
  },
});
