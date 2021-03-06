import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Overlay} from 'react-native-elements';

export default OverLayComponent = props => {
  return (
    <Overlay
      isVisible={props.visible}
      overlayStyle={styles.overlayStyle}
      onBackdropPress={props.toggleOverlay}
      backdropStyle={styles.backdropStyle}>
      <Text style={styles.wantToLogoutText}>{props.actionName}</Text>
      <View style={styles.overlayBottomView}>
        <TouchableOpacity onPress={props.toggleOverlay}>
          <Text style={styles.noText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.action}>
          <Text style={styles.yesText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    backgroundColor: '#1d2533',
    borderRadius: 10,
    width: '80%',
    height: 100,
    borderRadius: 5,
  },
  backdropStyle: {
    backgroundColor: 'rgba( 0, 0, 0, 0.8)',
  },
  wantToLogoutText: {
    color: '#d4d4d4',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
  },
  overlayBottomView: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    flexDirection: 'row',
  },
  noText: {
    color: 'rgba(36, 123, 160, 0.8)',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  yesText: {
    color: 'rgba(36, 123, 160, 0.8)',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
