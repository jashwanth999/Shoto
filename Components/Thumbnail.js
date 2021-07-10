import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {setindex} from '../actions';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
export default function Thumbnail({index, url}) {
  const dispatch = useDispatch();
  const scroll = () => {
    // storing index in reducers for onClick scroll to image

    dispatch(setindex(index));
  };
  const Image = createImageProgress(FastImage);

  return (
    <View style={{marginBottom: 4}}>
      <TouchableOpacity
        style={{
          backgroundColor: '#424949',
          height: 50,
          width: 50,
          borderRadius: 2,
        }}
        onPress={scroll}>
        <Image
          indicatorProps={{
            size: 10,
            borderWidth: 0,
            color: 'white',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          style={{
            height: 50,
            width: 50,
            opacity: 0.85,
            resizeMode: 'cover',
            borderRadius: 2,
            overflow: 'hidden',
          }}
          source={{
            uri: url,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
