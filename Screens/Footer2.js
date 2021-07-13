import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {MaterialCommunityIcons, MaterialIcons} from '../Styles/Icons';
function Footer2(props) {
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
});

export default Footer2;
