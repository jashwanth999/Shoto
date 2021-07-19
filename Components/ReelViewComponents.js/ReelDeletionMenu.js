import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
export default ReelDeletionMenu = ({toolref, toggleOverlay}) => {
  return (
    <View style={styles.reelDeletionView}>
      <TouchableOpacity
        onPress={() => {
          toggleOverlay();
          toolref.current.toggleTooltip();
        }}>
        <Text style={styles.deleteReelText}>Delete Reel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  reelDeletionMenu: {
    height: 40,
    width: 150,
    backgroundColor: '#1d2533',
    borderRadius: 2,
  },
  reelDeletionView: {
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  deleteReelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
});
