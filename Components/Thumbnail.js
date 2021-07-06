import React, {useState} from 'react';
import {TouchableOpacity, Image, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {setindex} from '../actions';
import FastImage from 'react-native-fast-image';
export default function Thumbnail({index, url, trigger}) {
  const [loadEnd, setLoadEnd] = useState(true);
  const dispatch = useDispatch();
  const scroll = () => {
    // storing index in reducers for onClick scroll to image
    dispatch(setindex(index));
  };
 

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
        <FastImage
          onLoadEnd={() => {
            setLoadEnd(false);
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
            priority: FastImage.priority.low,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
