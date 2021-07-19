import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default DeleteReelOverlay = props => {
  return (
    <Overlay
      overlayStyle={styles.overlayStyle}
      isVisible={props.visible}
      backdropStyle={{backgroundColor: 'rgba( 0, 0, 0, 0.8)'}}
      onBackdropPress={props.toggleOverlay}>
      <View style={styles.deleteReel}>
        <MaterialCommunityIcons
          name="table-column-remove"
          style={styles.icon}
        />
        <View style={{width: '60%'}}>
          <Text style={styles.text}>Delete Reel</Text>
          <Text style={styles.subText}>
            Other Contributors will still able to see the reel
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButtonsContainer}
          onPress={props.toggleOverlay}>
          <Text style={styles.footertext}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.deleteReel}
          style={styles.footerButtonsContainer}>
          <Text style={styles.footertext}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    height: 170,
    width: 260,
    backgroundColor: 'rgba(29,37,51,1)',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 6,
  },
  deleteReel: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  text: {
    color: 'rgba(212,212,212,1)',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  footer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingBottom: 15,
  },
  footertext: {
    fontSize: 15,
    color: '#d4d4d4',
  },
  footerButtonsContainer: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 3,
    width: '40%',
    alignItems: 'center',
  },
});
