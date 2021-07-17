import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Ionicons} from '../../Styles/Icons';

export default RemoveIcon = ({deleteContributors, useremail, admin, user}) => {
  if (admin === user.email && admin !== useremail) {
    return (
      <Ionicons
        style={styles.icon}
        name="ios-close-outline"
        color="#d4d4d4"
        size={21}
        onPress={() => {
          deleteContributors(useremail);
        }}
      />
    );
  } else {
    return <View></View>;
  }
};
const styles = StyleSheet.create({
  icon: {
    paddingRight: 5,
  },
});
