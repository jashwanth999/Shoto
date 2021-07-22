import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '../Styles/Icons';

export default Footer = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={props.onIcon1Press}
        style={styles.fotterView}>
        {props.check === 'home' ? (
          <MaterialCommunityIcons
            name={props.icon1}
            color="#d4d4d4"
            size={24}
          />
        ) : (
          <MaterialIcons name={props.icon1} color="#d4d4d4" size={24} />
        )}
        <Text style={styles.text}>{props.icon1Name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          props.onIcon2Press(
            props.reelName,
            props.reelId,
            props.navigateScreenName,
          );
        }}
        style={styles.middleIcon}>
        <MaterialCommunityIcons name={props.icon2} color="#d4d4d4" size={34} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={props.onIcon3Press}
        style={styles.fotterView}>
        {props.check != 'home' ? (
          <MaterialCommunityIcons
            name={props.icon3}
            color="#d4d4d4"
            size={24}
          />
        ) : (
          <Ionicons name={props.icon3} color="#d4d4d4" size={24} />
        )}

        <Text style={styles.text}>{props.icon3Name}</Text>
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
});
