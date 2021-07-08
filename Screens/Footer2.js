import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {MaterialCommunityIcons, MaterialIcons} from '../Styles/Icons';
import ImagePicker from 'react-native-image-crop-picker';
import {auth, db} from '../Security/firebase';
import {useDispatch, useSelector} from 'react-redux';
import {RNS3} from 'react-native-aws3';
import {clearScrollData, setindex} from '../actions';
function Footer2({navigation}) {
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const reeldata = useSelector(state => state.reeldata.reeldata);
  const takePhoto2 = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
    }).then(image => {
      const file = {
        uri: image.path,
        name: image.path.replace(/^.*[\\\/]/, ''),
        type: 'image/png',
      };
      const options = {
        keyPrefix: `uploads/${currentUser.uid}/`,
        bucket: 'shotoclick',
        region: 'ap-south-1',
        accessKey: 'AKIAR77UFFI6JWKBCVUU',
        secretKey: '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',
        successActionStatus: 201,
      };
      try {
        RNS3.put(file, options).then(response => {
          if (response.status !== 201) {
            alert('Some error occurred');
          } else {
            navigation.navigate('ReelView');
            dispatch(clearScrollData());
            dispatch(setindex(0));
            db.collection('reels')
              .doc(reeldata.reelid)
              .collection('reelimages')
              .add({
                uploadedby: user.email,
                imageurl: response.body.postResponse.location,
                uploaderpropic: user.profilepic,
                timestamp: new Date(),
                uploadername: user.username,
              });
          }
        });
      } catch (err) {}
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Adduserlist');
        }}
        style={styles.fotterView}>
        <MaterialIcons name="person-add" color="#d4d4d4" size={24} />
        <Text style={styles.text}>Add People</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhoto2} style={styles.middleIcon}>
        <MaterialCommunityIcons name="camera-iris" color="#d4d4d4" size={34} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Shotohome');
        }}
        style={styles.fotterView}>
        <MaterialIcons name="home" color="#d4d4d4" size={24} />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
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
    fontSize: 11,
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
    marginRight: 10,
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
    height: 160,
    width: 270,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1d2533',
  },
  createnewthread: {
    fontSize: 20,
    color: '#d4d4d4',
    marginTop: 10,
  },
  whatshouldwenameit: {
    color: '#d4d4d4',
    fontSize: 14,
    marginTop: 10,
  },
  textinput: {
    padding: 2,
    borderRadius: 5,
    width: '95%',
    fontSize: 14,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    color: '#d4d4d4',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
  },
  footertext: {
    fontSize: 15,
    color: '#d4d4d4',
  },
  actcontainer: {
    height: 150,
    width: 250,
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

export default Footer2;
