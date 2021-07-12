import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
export default function StartingHomePage() {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 25, color: '#d4d4d4'}}>Welcome</Text>
      <Text style={{fontSize: 25, color: '#d4d4d4'}}>Shotographer!</Text>
      <View style={styles.second}>
        <Text style={{fontSize: 18, color: '#d4d4d4'}}>Let's Start by</Text>
        <Text style={{fontSize: 18, color: '#d4d4d4'}}>
          Creating a New Reel
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  first: {
    justifyContent: 'center',
  },
  second: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
});
