import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Ionicons, MaterialCommunityIcons} from '../Styles/Icons';
import {Overlay} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {Addreeldata} from '../actions';
import {db} from '../Security/firebase';
import ImagePicker from 'react-native-image-crop-picker';

function Footer({navigation}) {
  const dispatch = useDispatch();

  const changed = useSelector(state => state.changed.changed);
  // user deatails
  const user = useSelector(state => state.user.user);

  //  list of all reel names of a user

  const reelnames = useSelector(state => state.reelnames.Reelnames);

  const [visible, setVisible] = useState(false);

  const [act, setact] = useState(false); // activity indicator

  const [reelname, setreelname] = useState(''); // text input value

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const addreel = () => {
    // checking whether the reelname is previously used or not

    if (!reelnames.includes(reelname.toLowerCase())) {
      setact(true);

      try {
        db.collection('user_reels')
          .doc(user.email)
          .collection('reellist')
          .add({
            reelname: reelname,
            timestamp: new Date(),
          })
          .then(res => {
            setact(false);
            dispatch(
              Addreeldata({
                useremail: user.email,
                reelname: reelname,
                reelid: res.id,
                username: user.username,
              }),
            );
            navigation.navigate('Adduserlist');
            toggleOverlay();
            db.collection('reels').doc(res.id).set({
              created_useremail: user.email,
              reelname: reelname,
              created_at: new Date(),
            });
            db.collection('reels')
              .doc(res.id)
              .collection('reelusers')
              .doc(user.email)
              .set({
                useremail: user.email,
                reelid: res.id,
                timestamp: new Date(),
                profilepic: user.profilepic,
              });

            // dispatch(setChange(!changed));
          });
      } catch (error) {
        alert(error.message);
        setact(false);
        toggleOverlay();
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
        navigation.navigate('selectimagescreen', {
          image: image.path,
          imagename: image.path.replace(/^.*[\\\/]/, ''),
        });
      })
      .catch(err => {
        // Here you handle if the user cancels or any other errors
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleOverlay} style={styles.fotterView}>
        <MaterialCommunityIcons name="movie-roll" color="#d4d4d4" size={24} />
        <Text style={styles.text}>New reel</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={takePhoto} style={styles.middleIcon}>
        <MaterialCommunityIcons name="camera-iris" color="#d4d4d4" size={34} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('userprofile')}
        style={styles.fotterView}>
        <Ionicons name="ios-person-circle" color="#d4d4d4" size={24} />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
      <Overlay
        isVisible={visible}
        overlayStyle={{backgroundColor: '#1d2533', borderRadius: 10}}
        onBackdropPress={toggleOverlay}
        backdropStyle={{backgroundColor: 'rgba( 0, 0, 0, 0.8)'}}>
        {act ? (
          <View style={styles.actcontainer}>
            <ActivityIndicator size="large" color="grey" />
          </View>
        ) : (
          <View style={styles.addreelnamecontainer}>
            <View style={{width: '100%', alignItems: 'center'}}>
              <Text style={styles.createnewthread}>New Reel !</Text>
            </View>
            <View style={{marginTop: 4, marginLeft: 4}}>
              <Text style={styles.whatshouldwenameit}>
                What should we name it ?
              </Text>
              <TextInput
                value={reelname}
                placeholderTextColor="grey"
                onChangeText={text => setreelname(text)}
                style={styles.textinput}
                placeholder="Getaway with friends"
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.footerButtonsContainer}
                onPress={toggleOverlay}>
                <Text style={styles.footertext}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerButtonsContainer}
                onPress={!reelname ? () => {} : addreel}>
                <Text style={styles.footertext}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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

export default Footer;
