import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {MaterialIcons} from '../../Styles/Icons.js';

export default ContributorsView = ({reelUsers}) => {
  return (
    <View style={styles.contributorsView}>
      {reelUsers.map((users, index) => {
        if (index < 3) {
          return (
            <Image
              key={index}
              source={{uri: users.profilepic}}
              style={styles.contributorsAvatar}
            />
          );
        }
      })}
      {reelUsers.length > 3 ? (
        <View style={styles.reelUsersGreaterThantThreeView}>
          <MaterialIcons name="add" color="white" size={13} />
          <Text style={styles.reelUserLengthText}>{reelUsers.length - 3}</Text>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  contributorsAvatar: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  contributorsView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
   
  },
  reelUserLengthText: {
    color: 'white',
    marginRight: 10,
  },
  reelUsersGreaterThantThreeView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 3,
  },
});
