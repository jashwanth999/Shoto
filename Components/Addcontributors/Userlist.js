import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Ionicons, MaterialCommunityIcons} from '../../Styles/Icons';

export default function Userlist({useremail, deleteContributors, admin}) {
  const user = useSelector(state => state.user.user);
  return (
    <View style={styles.container}>
      <AdminIcon
        deleteContributors={deleteContributors}
        useremail={useremail}
        admin={admin}
        user={user}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.text,
          {color: user.email === useremail ? '#247BA0' : 'white'},
        ]}>
        {useremail}
      </Text>
      <RemoveIcon
        deleteContributors={deleteContributors}
        useremail={useremail}
        admin={admin}
        user={user}
      />
    </View>
  );
}
const AdminIcon = ({deleteContributors, useremail, admin}) => {
  if (admin === useremail) {
    return (
      <MaterialCommunityIcons
        name="checkbox-blank-circle"
        color="#d4d4d4"
        size={18}
        style={{paddingLeft: 10, paddingRight: 3}}
        onPress={() => {
          deleteContributors(useremail);
        }}
      />
    );
  } else {
    return <View></View>;
  }
};
const RemoveIcon = ({deleteContributors, useremail, admin, user}) => {
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
  container: {
    margin: 5,
    width: '85%',
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 2,
    paddingBottom: 5,
    width: '90%',
  },
  icon: {
    paddingRight: 5,
  },
});
