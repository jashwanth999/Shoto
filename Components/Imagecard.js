import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import {TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';

export default function imagecard({
  navigation,
  uploadername,
  reelid,
  imageid,
  uploaderid,
  useremail,
  comments,
  t,
  url,
  profilepic,
  trigger,
  len,
}) {
  const [loadEnd, setLoadEnd] = useState(false);
  const Image = createImageProgress(FastImage);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('ImageView', {
            reelid: reelid,
            imageurl: url,
            uploadername: uploadername,
            uploaderid: uploaderid,
            imageid: imageid,
            useremail: useremail,
            t: t,
          })
        }
        style={styles.imagecard}>
        <FastImage
          onError={() => {
            setLoadEnd(true);
            console.log('true');
          }}
          style={styles.backgroundImage}
          source={{
            uri: url,
            priority: FastImage.priority.low,
         
          }}
        />
        <View style={styles.imagecardfooter}>
          <View style={{flexDirection: 'row'}}>
            <Avatar
              rounded
              source={{
                uri: profilepic
                  ? profilepic
                  : 'https://res.cloudinary.com/jashwanth/image/upload/v1624182501/60111_nihqdw.jpg',
              }}
            />
            <View style={styles.left}>
              <Text style={{color: '#d4d4d4', fontSize: 13}}>
                {uploadername}
              </Text>
              <Text style={{color: '#d4d4d4', fontSize: 11}}>{t}</Text>
            </View>
          </View>

          <View style={styles.right}>
            <Octicons
              name="comment-discussion"
              color="#d4d4d4"
              size={20}
              onPress={() => {}}
            />
            <Text style={{color: '#d4d4d4', marginBottom: 5, marginLeft: 4}}>
              {comments}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  imagecard: {
    width: '94%',
    height: 320,
    marginTop: 10,
    marginLeft: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  backgroundImage: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 260,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
    overflow: 'hidden',
  },
  imagecardfooter: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 15,
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
