import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default Remove = props => {
  if (props.uploaderid === props.user.email) {
    return (
      <Overlay
        overlayStyle={styles.overlayStyle}
        isVisible={props.visible}
        backdropStyle={{backgroundColor: 'rgba( 0, 0, 0, 0.8)'}}
        onBackdropPress={props.toggleOverlay}>
        <TouchableOpacity
          onPress={() => {
            props.removeFromReel(props.imageid);
          }}
          style={styles.deleteImage}>
          <MaterialCommunityIcons name="table-row-remove" style={styles.icon} />
          <View>
            <Text style={styles.text}>Remove from Reel</Text>
            <Text style={styles.subText}>Keep in my Photos</Text>
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() => {
            props.deletePermanently(props.imageid);
          }}
          style={styles.deleteImage}>
          <MaterialCommunityIcons name="delete-forever" style={styles.icon} />
          <View>
            <Text style={styles.text}>Delete permanently</Text>
            <Text style={styles.subText}>From Everywhere</Text>
          </View>
        </TouchableOpacity>
      </Overlay>
    );
  } else {
    return (
      <Overlay
        overlayStyle={styles.overlayStyle}
        isVisible={props.visible}
        backdropStyle={{backgroundColor: 'rgba( 0, 0, 0, 0.8)'}}
        onBackdropPress={props.toggleOverlay}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, color: 'white', fontWeight: 'bold'}}>
            You can only delete the photos you clicked
          </Text>
        </View>
      </Overlay>
    );
  }
};

const styles = StyleSheet.create({
  overlayStyle: {
    height: 140,
    width: 240,
    backgroundColor: 'rgba(29,37,51,1)',
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderRadius: 6,
  },
  deleteImage: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  text: {
    color: 'rgba(212,212,212,1)',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subText: {
    color: 'rgba(212,212,212,1)',
    fontSize: 11,
  },
  icon: {
    color: 'rgba(212,212,212,1)',
    fontSize: 30,
    margin: 8,
  },
});
