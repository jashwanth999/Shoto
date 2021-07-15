import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {setindex} from '../actions';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
export default function Thumbnail({
  index,
  cloudMediumImage,
  localMediumImage,
  isUploadedMedium,
}) {
  const dispatch = useDispatch();
  const scroll = () => {
    // storing index in reducers for onClick scroll to image
    dispatch(setindex(index));
  };
  const Image = createImageProgress(FastImage);
  return (
    <View style={{marginBottom: 4}}>
      <TouchableOpacity style={styles.thumbnailCard} onPress={scroll}>
        <Image
          indicatorProps={{
            size: 10,
            borderWidth: 0,
            color: 'white',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          style={styles.thumbnailImage}
          source={{
            uri: isUploadedMedium ? cloudMediumImage : localMediumImage,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  thumbnailCard: {
    backgroundColor: '#424949',
    height: 50,
    width: 50,
    borderRadius: 2,
  },
  thumbnailImage: {
    height: 50,
    width: 50,
    opacity: 0.85,
    resizeMode: 'cover',
    borderRadius: 2,
    overflow: 'hidden',
  },
});
