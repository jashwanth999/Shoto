import React from 'react';
import {View, Text,StyleSheet} from 'react-native';
export default TitleView = ({uploadername, t, d}) => {
  return (
    <View style={styles.titleView}>
      <Text style={styles.uploaderNameText}>{uploadername}</Text>
      <Text style={styles.date}>
        {' '}
        {t.split(' ')[1]} {t.split(' ')[2]} {t.split(' ')[3]} {d}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleView: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },

  uploaderNameText: {
    color: '#D7DBDD',
    fontSize: 16,
  },
  date: {
    color: '#D7DBDD',
    fontSize: 13,
  },
});
