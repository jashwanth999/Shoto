import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';

export default CreatorBadge = ({profilePic, uploaderName, dateTime, d}) => {
  return (
    <View style={styles.creatorBadge}>
      <Avatar
        rounded
        source={{
          uri: profilePic,
        }}
      />
      <View style={styles.userText}>
        <Text style={styles.creatorName}> {uploaderName} </Text>
        <Text style={styles.createdAt}>
          {' '}
          {dateTime.split(' ')[0]} {dateTime.split(' ')[1]}{' '}
          {dateTime.split(' ')[2]} {dateTime.split(' ')[3]}
          {'-'}
          {d}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  creatorBadge: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  commentsCount: {
    color: 'rgba(212,212,212,1)',
    marginLeft: 5,
  },
  userText: {
    width: 853,
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'stretch',
    margin: 5,
  },
  creatorName: {
    color: 'rgba(212,212,212,1)',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  createdAt: {
    color: 'rgba(212,212,212,1)',
    fontSize: 10,
    // marginVertical: 2,
  },
});
