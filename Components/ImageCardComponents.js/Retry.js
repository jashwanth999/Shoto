import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '../../Styles/Icons';
import {ActivityIndicator} from 'react-native';

export default Retry = ({retryUploadCloudImage, act}) => {
  return (
    <View style={styles.retryView}>
      <View style={styles.retry}>
        {act ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <MaterialCommunityIcons
            onPress={() => { 
              retryUploadCloudImage();
            }}
            name="cloud-upload-outline"
            color="#fff"
            size={34}
            style={styles.icon}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  retry: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    borderRadius: 60,
    justifyContent: 'center',
  },
  retryView: {
    width: '100%',
    height: 'auto',
    aspectRatio: 3 / 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 3,
  },
});
