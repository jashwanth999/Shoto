import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '../../Styles/Icons';

export default AdminIcon = ({deleteContributors, useremail, admin}) => {
  if (admin === useremail) {
    return (
      <MaterialCommunityIcons
        name="checkbox-blank-circle"
        color="#d4d4d4"
        size={18}
        style={styles.icon}
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
    paddingLeft: 10,
    paddingRight: 3,
  },
});
