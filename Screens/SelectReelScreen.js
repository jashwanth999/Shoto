import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Ionicons, MaterialIcons} from '../Styles/Icons';
import SelectImageReelList from '../Components/SelectImageReelList';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {Addreeldata, setindex} from '../actions';
import * as Sentry from '@sentry/react-native';
export default function SelectImageScreen({navigation, route}) {
  const {mediumImage, mediumImageName, originalImageName, originalImage} =
    route.params;
  const db = firestore();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [search, setSearch] = useState('');
  const [reels, setReels] = useState([]);
  const [startAfter, setStartAfter] = useState(null);
  const [LastPosition, setLastPosition] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const fetchReelList = async () => {
    try {
      return await db
        .collection('user_reels')
        .doc(user.email)
        .collection('reellist')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();
    } catch (error) {
      Sentry.captureException(error.message);
    }
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
    } catch (error) {
      Sentry.captureException(error.message);
    }
  };
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
        setReels(
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
  }, [user?.email]);
  const loadMore = () => {
    fetchReelListMore().then(snapshot => {
      if (snapshot && !LastPosition) {
        snapshot.docs.length < 5
          ? setLastPosition(true)
          : setLastPosition(false);
        const lastdata = snapshot.docs[snapshot.docs.length - 1];
        if (lastdata) {
          setStartAfter(lastdata);
        } else {
          setStartAfter(null);
        }
        setisLoading(true);
        setReels([
          ...reels,
          ...snapshot.docs.map(doc => ({
            id: doc.id,
            reellist: doc.data(),
          })),
        ]);
      }
    });
  };
  const renderReelList = useCallback(({item, index}) => {
    if (item.reellist?.reelname.toLowerCase().includes(search.toLowerCase())) {
      return (
        <SelectImageReelList
          id={item.id}
          name={item.reellist?.reelname}
          navigation={navigation}
          t={new Date(item.reellist?.timestamp?.seconds * 1000).toUTCString()}
          upload={upload}
        />
      );
    }
  });
  const upload = (name, id) => {
    dispatch(setindex(0));
    navigation.navigate('ReelView', {
      mediumImage: mediumImage,
      mediumImageName: mediumImageName,
      originalImage: originalImage,
      originalImageName: originalImageName,
    });
    dispatch(
      Addreeldata({
        reelname: name,
        reelid: id,
      }),
    );
  };
  return (
    <View style={styles.container}>
      <HeaderComponent navigation={navigation} />
      <StatusBar backgroundColor="#1d2533" />
      <SearchBar search={search} setSearch={setSearch} />
      {isLoading ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={reels}
          initialNumToRender={5}
          renderItem={renderReelList}
          keyExtractor={item => item.id}
          onEndReached={loadMore}
          onEndReachedThreshold={5}
          ListFooterComponent={
            !LastPosition && <ActivityIndicator color="grey" size="small" />
          }
          scrollEventThrottle={150}
        />
      ) : (
        <LoadingView />
      )}
    </View>
  );
}

const HeaderComponent = ({navigation}) => {
  return (
    <Header
      containerStyle={{
        backgroundColor: '#1d2533',
        borderBottomColor: 'none',
        height: 90,
      }}
      leftComponent={
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back"
          color="#d4d4d4"
          size={21}
        />
      }
      centerComponent={
        <View style={styles.headerView}>
          <Text
            style={{
              color: '#d4d4d4',
              fontSize: 16,

              fontWeight: 'bold',
            }}>
            Select a Reel to Save
          </Text>
        </View>
      }
    />
  );
};
const SearchBar = props => {
  return (
    <View style={styles.searchView}>
      <MaterialIcons
        name="search"
        style={{paddingLeft: 5}}
        color="white"
        size={26}
      />
      <TextInput
        value={props.search}
        onChangeText={text => props.setSearch(text)}
        placeholderTextColor="grey"
        style={styles.textinput}
        placeholder="Type Here"
      />
    </View>
  );
};
const LoadingView = () => {
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
    width: '90%',
    borderWidth: 1,
    borderColor: 'grey',
    flexDirection: 'row',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 5,
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
