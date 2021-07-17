import React from 'react';
import {View, StyleSheet} from 'react-native';
import ZoomImageView from '../Components/PhotoViewComponents/ZoomImageView';
import BackButton from '../Components/ImageViewComponents/BackButton';
export default function Photoview({navigation, route}) {
  const {cloudOriginalImage} = route.params;

  return (
    <View style={styles.container}>
      <ZoomImageView imageurl={cloudOriginalImage} />
      <BackButton navigation={navigation} />
    </View>
  );
}

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
