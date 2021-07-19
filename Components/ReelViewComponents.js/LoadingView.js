import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
export default LoadingView = () => {
  return (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
};
const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
