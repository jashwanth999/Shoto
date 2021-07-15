import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Ionicons} from '../Styles/Icons';
import Image from 'react-native-image-progress';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import ProgressBar from 'react-native-progress/Bar';
export default function Photoview({navigation, route}) {
  const {imageurl, cloudOriginalImage} = route.params;

  return (
    <View style={styles.container}>
      <ZoomImageView imageurl={cloudOriginalImage} />
      <BackButton navigation={navigation} />
    </View>
  );
}
const ZoomImageView = ({imageurl}) => {
  return (
    <ReactNativeZoomableView
      maxZoom={1.5}
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
const BackButton = ({navigation}) => {
  return (
    <View style={styles.backButtonView}>
      <Ionicons
        onPress={() => navigation.goBack()}
        name="md-chevron-back-circle-outline"
        color="white"
        size={35}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backButtonView: {
    position: 'absolute',
    top: 45,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
    alignContent: 'center',
  },
  backIcon: {
    marginLeft: 3,
  },
  image: {
    flex: 1,
    overflow: 'hidden',
  },
  zoomableView: {
    backgroundColor: 'black',
  },
});
