import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Center} from '@builderx/utils';

function DeleImageModal(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.subContainer}>
        <View style={styles.buttonContainer}>
          <MaterialCommunityIconsIcon
            name="table-row-remove"
            style={styles.icon}></MaterialCommunityIconsIcon>
          <View style={styles.textWrapper}>
            <Text style={styles.mainText}>Remove from Reel</Text>
            <Text style={styles.subText}>Keep in my Photos</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <MaterialCommunityIconsIcon
            name="delete-forever"
            style={styles.icon}></MaterialCommunityIconsIcon>
          <View style={styles.textWrapper}>
            <Text style={styles.mainText}>Delete Permanently</Text>
            <Text style={styles.subText}>From Everywhere</Text>
          </View>
        </View>
        <Center vertical>
          <View style={styles.divider}></View>
        </Center>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(29,37,51,1)',
  },
  subContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flex: 1,
    padding: 0,
    paddingLeft: 15,
  },
  icon: {
    color: 'rgba(212,212,212,1)',
    fontSize: 30,
    margin: 8,
  },
  textWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 0,
    margin: 'null',
  },
  mainText: {
    color: 'rgba(212,212,212,1)',
    margin: 1,
    fontSize: 12,
    alignSelf: 'stretch',
    flex: 1,
  },
  subText: {
    color: 'rgba(212,212,212,1)',
    margin: 1,
    fontSize: 8,
    alignSelf: 'stretch',
    flex: 1,
  },
  divider: {
    left: 0,
    height: 1,
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.07)',
    right: 0,
  },
});

export default DeleImageModal;
