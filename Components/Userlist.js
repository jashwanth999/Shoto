import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import RemoveIcon from './UserListComponents/RemoveIcon';
import AdminIcon from './UserListComponents/AdminIcon';
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
 
});
