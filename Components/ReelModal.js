import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
export default Modal = props => {
  return (
    <Overlay
      isVisible={props.visible}
      overlayStyle={styles.overlayStyle}
      onBackdropPress={props.toggleOverlay}
      backdropStyle={{backgroundColor: 'rgba( 0, 0, 0, 0.8)'}}>
      <View style={styles.addreelnamecontainer}>
        <View style={styles.newReelView}>
          <Text style={styles.createnewthread}>New Reel !</Text>
        </View>
        <View style={styles.nameView}>
          <Text style={styles.whatshouldwenameit}>
            What should we name it ?
          </Text>
          <TextInput
            value={props.reelname}
            placeholderTextColor="grey"
            onChangeText={text => props.setreelname(text)}
            style={styles.textinput}
            placeholder="Getaway with friends"
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButtonsContainer}
            onPress={props.toggleOverlay}>
            <Text style={styles.footertext}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButtonsContainer}
            onPress={!props.reelname ? () => {} : props.addReel}>
            <Text style={styles.footertext}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};
const styles = StyleSheet.create({
  overlayStyle: {
    backgroundColor: '#1d2533',
    borderRadius: 10,
  },
  newReelView: {
    width: '100%',
    alignItems: 'center',
  },

  modalContainer: {
    backgroundColor: '#1d2533',
    borderColor: '#262626',
    borderTopWidth: 0.25,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fotterView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    color: '#d4d4d4',
    fontSize: 13,
  },

  addreelnamecontainer: {
    height: 200,
    width: 290,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1d2533',
    paddingTop: 15,
    justifyContent: 'space-between',
  },
  createnewthread: {
    fontSize: 20,
    color: '#d4d4d4',
    marginTop: 10,
  },
  whatshouldwenameit: {
    color: '#d4d4d4',
    fontSize: 14,
  },
  textinput: {
    padding: 2,
    borderRadius: 5,
    width: '95%',
    fontSize: 16,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    color: '#d4d4d4',
    marginTop: 4,
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
  nameView: {
    marginTop: 4,
    marginLeft: 4,
  },
});
