import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {Ionicons, MaterialCommunityIcons} from '../Styles/Icons';
import {useSelector, useDispatch} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Addreel, Adduser} from '../actions';
import auth from '@react-native-firebase/auth';
import OverLayComponent from '../Components/UserProfileComponents/OverLayComponent';
import HelloComponent from '../Components/UserProfileComponents/HelloComponent';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import {Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';
function UserProfile({navigation}) {
  const Image = createImageProgress(FastImage);
  const db = firestore();
  const reelnames = useSelector(state => state.reelnames.Reelnames);
  const numColumns = 3;
  const size = (Dimensions.get('window').width - 15) / numColumns;
  GoogleSignin.configure({
    scopes: [], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '821295087358-f7nsmu3rup0ghfflnvk7ret61mv49gec.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });

  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const signOut = async () => {
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem('email');
    await auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login');

        // clear data
        toggleOverlay();
        dispatch(Addreel(null));
        dispatch(Adduser(null));
      });
  };

  const [isLoading, setIsLoading] = useState(false);

  const [userPhotos, setUserPhotos] = useState([]);

  useEffect(() => {
    db.collection('user_reels')
      .doc(user?.email)
      .collection('AllUserPhotos')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setUserPhotos(
          snapshot.docs.map(doc => ({
            imageid: doc.id,
            images: doc.data(),
          })),
        );
        setIsLoading(true);
      });
  }, [user?.email]);
  const renderImage = useCallback(({item, index}) => {
    //const t = new Date(item.images?.timestamp?.seconds * 1000).toUTCString();

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Photoview', {
            cloudOriginalImage: item.images.cloudMediumImage,
            timestamp: new Date(
              item.images?.timestamp?.seconds * 1000,
            ).toUTCString(),
            time: item.images?.date,
          });
        }}>
        <Image
          resizeMode="cover"
          style={[styles.image, {height: size, width: size}]}
          source={{
            uri: item.images.cloudMediumImage,
          }}
        />
      </TouchableOpacity>
    );
  }, []);
  return (
    <View showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <View style={styles.avatarView}>
            <Avatar
              source={{
                uri: user?.profilepic,
              }}
              size={70}
              rounded
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <HelloComponent />
            <Text style={styles.userNameText}>{user?.username}</Text>
          </View>
        </View>
        <Text
          style={{
            position: 'absolute',
            bottom: 10,
            color: '#d4d4d4',
            fontSize: 14,
          }}>
          {reelnames.length} reels - {userPhotos.length} Photos
        </Text>
      </View>
      {!isLoading ? (
        <View>
          <ActivityIndicator color="#d4d4d4" />
        </View>
      ) : (
        <FlatList
          initialNumToRender={10}
          updateCellsBatchingPeriod={30}
          ListHeaderComponent={<View style={{marginTop: 10}}></View>}
          removeClippedSubviews={false}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          data={userPhotos}
          renderItem={renderImage}
          keyExtractor={item => item.imageid}
          numColumns={numColumns}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Shotohome');
        }}
        style={styles.backButtonView}>
        <Ionicons name="chevron-back" color="#d4d4d4" size={21} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutIconButton}
        onPress={() => {
          toggleOverlay();
        }}>
        <MaterialCommunityIcons name="logout" color="white" size={22} />
      </TouchableOpacity>
      <OverLayComponent
        visible={visible}
        toggleOverlay={toggleOverlay}
        actionName={'Do you want to logout ?'}
        action={signOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: 'rgba(29, 37, 51, 1)',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    alignSelf: 'center',
    color: '#d4d4d4',
    fontSize: 16,
    marginTop: 6,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },

  materialButton: {
    minHeight: 40,
    width: '40%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,212,212,1)',
    margin: 20,
  },
  avatarView: {
    marginRight: 18,
    marginTop: 10,
  },
  input: {
    flex: 1,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
  },

  backButtonView: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: 10,
    top: 40,
  },
  backButtonText: {
    color: '#d4d4d4',
    fontSize: 15,
  },

  saveView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutIconButton: {
    position: 'absolute',
    right: 10,
    top: 40,
  },
  imagesView: {
    marginRight: 3,
  },
  allUserPhotoText: {
    color: '#d4d4d4',
    fontSize: 18,
  },
  leftHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
  },
  homeText: {
    color: '#d4d4d4',
    fontSize: 15,
  },
  image: {
    margin: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  text: {
    color: '#d4d4d4',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  allYourPhotosView: {
    marginTop: 30,
    marginBottom: 15,
  },
});

export default UserProfile;
