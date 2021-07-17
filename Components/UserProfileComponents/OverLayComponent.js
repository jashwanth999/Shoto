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
      <Text style={styles.wantToLogoutText}> Do you want to logout ?</Text>
      <View style={styles.overlayBottomView}>
        <TouchableOpacity onPress={props.toggleOverlay}>
          <Text style={styles.noText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.signOut}>
          <Text style={styles.yesText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    height: 100,
    borderRadius: 5,
  },
  backdropStyle: {
    backgroundColor: 'rgba( 0, 0, 0, 0.8)',
  },
  wantToLogoutText: {
    color: 'black',
    fontSize: 20,
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
    color: '#29A7EC',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  yesText: {
    color: '#29A7EC',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
