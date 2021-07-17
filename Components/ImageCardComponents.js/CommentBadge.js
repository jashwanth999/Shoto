import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Octicons} from '../../Styles/Icons';

export default CommentBadge = ({comments}) => {
  return (
    <View style={styles.commentBadge}>
      <Octicons name="comment-discussion" color="#d4d4d4" size={20} />
      <Text style={styles.commentsCount}>{comments}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentsCount: {
    color: 'rgba(212,212,212,1)',
    marginLeft: 5,
  },

  commentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
