import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
export default function Comments({url, name, comment}) {
  return (
    <View>
      <ListItem containerStyle={styles.container} bottomDivider>
        <Avatar rounded source={{uri: url}} />
        <ListItem.Content>
          <ListItem.Title style={styles.title}>{name}</ListItem.Title>
          <ListItem.Subtitle style={styles.subTitle}>
            {comment}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    color: '#D7DBDD',
  },
  subTitle: {
    color: '#D7DBDD',
  },
  container: {
    backgroundColor: 'black',
  },
});
