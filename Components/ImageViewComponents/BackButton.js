import React from 'react';
import {StyleSheet,View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default  BackButton = ({navigation}) => {
    return (
      <View style={styles.backButtonView}>
        <Ionicons
          onPress={() => {
            navigation.goBack();
          }}
          name="md-chevron-back-circle-outline"
          color="white"
          style={{marginLeft: 3}}
          size={35}
        />
      </View>
    );
  };
 
  const styles = StyleSheet.create({
    
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
    
  });