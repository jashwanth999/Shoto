import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import ZoomImageView from '../Components/PhotoViewComponents/ZoomImageView';
import BackButton from '../Components/ImageViewComponents/BackButton';

export default function Photoview({navigation, route}) {
  const {cloudOriginalImage, timestamp, time} = route.params;

  return (
    <View style={styles.container}>
      <ZoomImageView imageurl={cloudOriginalImage} />
      <BackButton navigation={navigation} />
      <Footer t={timestamp} time={time} />
    </View>
  );
}
const Footer = ({t, time}) => {
  return (
    <View style={styles.footer}>
      {t != 'Invalid Date' && (
        <Text style={styles.timestamp}>
          {' '}
          {t.split(' ')[1]} {t.split(' ')[2]} {t.split(' ')[3]} {time}
        </Text>
      )}
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
  footer: {
    position: 'absolute',
    height: 40,
    width: '100%',
    backgroundColor: 'black',
    bottom: 0,
  },
  timestamp: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
