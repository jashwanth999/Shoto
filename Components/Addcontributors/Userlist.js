import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "../../Styles/Icons";
import { useSelector } from "react-redux";

import firestore from '@react-native-firebase/firestore'
export default function Userlist({ useremail, admin }) {
  const db=firestore
  const reeldata = useSelector((state) => state.reeldata.reeldata);
  const user = useSelector((state) => state.user.user);
  const deleteUser = () => {
    if (admin === user.email) {
      if (admin === useremail) {
        alert("You cannot delete yourself");
      } else {
        db.collection("reels")
          .doc(reeldata.reelid)
          .collection("reelusers")
          .doc(useremail)
          .delete();
        db.collection("user_reels")
          .doc(useremail)
          .collection("reellist")
          .doc(reeldata.reelid)
          .delete();
      }
    } else {
      alert("only admin can delete contributors");
    }
  };

  return (
    <View style={styles.container}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
        {useremail}
      </Text>
      <Ionicons
        style={{ paddingRight: 5 }}
        name="ios-close-outline"
        color="#d4d4d4"
        size={21}
        onPress={deleteUser}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 5,
    width: "80%",
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 15,
    paddingLeft: 15,
    paddingTop: 2,
    paddingBottom: 5,
    width: "90%",
  },
});
