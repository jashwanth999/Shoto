import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Header } from "react-native-elements";
import  MaterialCommunityIcons  from "react-native-vector-icons/MaterialCommunityIcons";
import  Ionicons  from "react-native-vector-icons/Ionicons";
import Userlist from "./Userlist";
import { db } from "../../Security/firebase";
import { useSelector, useDispatch } from "react-redux";
import {  reeluseremail } from "../../actions";
export default function Adduserslist({ navigation }) {
  const [profilepic, setprofilepic] = useState(null);
  const [inputemail, setinputemail] = useState("");
  const [act, setact] = useState(true);

  const [admin, setAdmin] = useState("");
  const dispatch = useDispatch();

  // get emails list stored in reducers

  const emails = useSelector((state) => state.emails.emails);

  // get details of reel stored in reducers

  const reeldata = useSelector((state) => state.reeldata.reeldata);

  // validating email using regex concept

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  useEffect(() => {
    const unsubscribe = db
      .collection("reels")
      .doc(reeldata.reelid)
      .onSnapshot((doc) => {
        setAdmin(doc.data()?.created_useremail);
      });
    return unsubscribe;
  }, [reeldata.reelid]);

  // get reel user emails

  useEffect(() => {
    const unsubscribe = db
      .collection("reels")
      .doc(reeldata.reelid)
      .collection("reelusers")
      .onSnapshot((snapshot) => {
        dispatch(
          reeluseremail(snapshot.docs.map((doc) => doc.data()?.useremail))
        );
      });
    return unsubscribe;
  }, [reeldata.reelid]);

  // get user profie pics

  useEffect(() => {
    if (inputemail) {
      const unsubscribe = db
        .collection("users")
        .doc(inputemail.toLowerCase())
        .onSnapshot((doc) => {
          setprofilepic(doc.data()?.profilepic);
        });
      return unsubscribe;
    }
  }, [inputemail]);
  const add = async () => {
    // adding users to reels

    if (inputemail && validateEmail(inputemail.toLowerCase())) {
      try {
        setact(false);
        await db
          .collection("reels")
          .doc(reeldata.reelid)
          .collection("reelusers")
          .doc(inputemail.toLowerCase())
          .set({
            useremail: inputemail.toLowerCase(),
            profilepic: profilepic
              ? profilepic
              : "https://res.cloudinary.com/jashwanth/image/upload/v1624182501/60111_nihqdw.jpg",
            timestamp: new Date(),
            reelid: reeldata.reelid,
          })
          .then(async () => {
            setact(true);
            db.collection("user_reels")
              .doc(inputemail.toLowerCase())
              .collection("reellist")
              .doc(reeldata.reelid)
              .set({
                reelname: reeldata.reelname,
                timestamp: new Date(),
              });
          });
        setinputemail("");
      } catch (error) {
        alert("some error as occured");
        setact(true);
      }
    } else {
      alert("It's not a valid email");
    }
  };

  return (
    <View style={styles.container}>
      <Header
        containerStyle={{
          backgroundColor: "#1d2533",
          borderBottomColor: "none",
          height: 90,
        }}
        leftComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ReelView");
            }}
          >
            <Ionicons name="chevron-back" color="#d4d4d4" size={24} />
          </TouchableOpacity>
        }
        centerComponent={
          <View style={{}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
            >
              {reeldata.reelname}
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate("Shotohome")}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              color="white"
              size={26}
            />
          </TouchableOpacity>
        }
      />
      <StatusBar backgroundColor="#1d2533" />

      <View style={styles.inputview}>
        <Text style={{ color: "white", fontWeight: "bold", marginLeft: 10 }}>
          Type email id of the people you want to add
        </Text>
        <TextInput
          value={inputemail}
          onChangeText={(text) => setinputemail(text)}
          placeholder="abc@example.com"
          placeholderTextColor="grey"
          style={styles.textinput}
        />
      </View>
      <View style={styles.addView}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={add}
          style={styles.addButton}
        >
          {act ? (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {" "}
              ADD
            </Text>
          ) : (
            <ActivityIndicator color="white" />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ marginTop: 15, marginLeft: 10 }}>
        {emails.map((users, index) => (
          <Userlist key={index} useremail={users} admin={admin} />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  textinput: {
    color: "white",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    width: "90%",
    fontSize: 16,
    paddingBottom: 2,
    paddingTop: 0,
    marginLeft: 10,
  },
  inputview: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "column",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#1d2533",
    width: "40%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    borderWidth: 1,
    borderColor: "white",
  },
  addView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});
