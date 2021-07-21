import React from 'react';
import {StyleSheet} from 'react-native';
import Image from 'react-native-image-progress';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import ProgressBar from 'react-native-progress/Bar';
export default ZoomImageView = ({imageurl}) => {
  return (
    <ReactNativeZoomableView
      maxZoom={2}
      minZoom={0.5}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
      style={styles.zoomableView}>
      <Image
        indicator={ProgressBar}
        resizeMode="contain"
        indicatorProps={{
          size: 40,
          borderWidth: 0,
          color: 'rgba(36, 123, 160, 1)',
          unfilledColor: 'rgba(36, 123, 160, 0.2)',
        }}
        source={{uri: imageurl}}
        style={styles.image}
      />
    </ReactNativeZoomableView>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    overflow: 'hidden',
  },
  zoomableView: {
    backgroundColor: 'black',
  },
});
