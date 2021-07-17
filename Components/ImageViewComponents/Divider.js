import React from 'react';
import {StyleSheet, View} from 'react-native';

export default Divider = () => {
  return (
    <View style={styles.dividerView}>
      <View style={styles.divider}></View>
    </View>
  );
};

const styles = StyleSheet.create({
 
  dividerView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  divider: {
    width: 140,
    height: 5,
    backgroundColor: 'grey',
    borderRadius: 40,
  },
});
