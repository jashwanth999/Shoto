import React from "react";
import { View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
export default function Comments({ url, name, comment }) {
  return (
    <View>
      <ListItem containerStyle={{ backgroundColor: "black" }} bottomDivider>
        <Avatar rounded source={{ uri: url }} />
        <ListItem.Content>
          <ListItem.Title style={{ color: "#D7DBDD" }}>{name}</ListItem.Title>
          <ListItem.Subtitle style={{ color: "#D7DBDD" }}>
            {comment}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </View>
  );
}
