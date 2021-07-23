import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
export default function HelloComponent() {
  return (
    <View style={styles.helloContainer}>
      <Text style={[styles.helloText, {color: '#0F9D58'}]}>H</Text>
      <Text style={[styles.helloText, {color: '#DB4437'}]}>e</Text>
      <Text style={[styles.helloText, {color: '#4285F4'}]}>l</Text>
      <Text style={[styles.helloText, {color: '#4285F4'}]}>l</Text>
      <Text style={[styles.helloText, {color: '#F4B400'}]}>o</Text>
      <Text style={[styles.helloText, {color: '#0F9D58'}]}>!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  helloContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
  helloText: {
    alignSelf: 'center',
    color: '#d4d4d4',
    fontSize: 40,
    fontWeight: 'bold',
    margin: 4,
  },
});
