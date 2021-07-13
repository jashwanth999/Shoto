import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '../Styles/Icons';
function Footer(props) {
  if (props.page === 'home') {
    return (
      <HomeFooter
        navigation={props.navigation}
        takePhoto={props.takePhoto}
        toggleOverlay={props.toggleOverlay}
      />
    );
  } else {
    return (
      <ReelViewFooter
        takePhoto={props.takePhoto}
        navigation={props.navigation}
      />
    );
  }
}
const HomeFooter = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={props.toggleOverlay}
        style={styles.fotterView}>
        <MaterialCommunityIcons name="movie-roll" color="#d4d4d4" size={24} />
        <Text style={styles.text}>New reel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={props.takePhoto}
        style={styles.middleIcon}>
        <MaterialCommunityIcons name="camera-iris" color="#d4d4d4" size={34} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('userprofile')}
        style={styles.fotterView}>
        <Ionicons name="ios-person-circle" color="#d4d4d4" size={24} />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};
const ReelViewFooter = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate('Adduserlist');
        }}
        style={styles.fotterView}>
        <MaterialIcons name="person-add" color="#d4d4d4" size={24} />
        <Text style={styles.text}>Add People</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={props.takePhoto}
        style={styles.middleIcon}>
        <MaterialCommunityIcons name="camera-iris" color="#d4d4d4" size={34} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate('Shotohome');
        }}
        style={styles.fotterView}>
        <MaterialIcons name="home" color="#d4d4d4" size={24} />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

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
