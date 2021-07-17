import React from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
export default ImageThumbnail = ({imageUri}) => {
  const Image = createImageProgress(FastImage);
  return (
    <View style={{flex: 1}}>
      <Image
        indicator={ProgressBar}
        indicatorProps={{
          size: 40,
          borderWidth: 0,
          color: 'rgba(150, 150, 150, 1)',
          unfilledColor: 'rgba(200, 200, 200, 0.2)',
        }}
        style={styles.imageStyle}
        source={{
          uri: imageUri,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    height: 95,
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
});
