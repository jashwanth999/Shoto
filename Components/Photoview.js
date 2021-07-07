import React from "react";
import { View,  StyleSheet} from "react-native";
import { Ionicons } from "../Styles/Icons";
import FastImage from "react-native-fast-image";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
export default function Photoview({ navigation, route }) {
  const { imageurl } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ReactNativeZoomableView
        maxZoom={1.5}
        minZoom={0.5}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        style={{
          backgroundColor: "black",
        }}
      >
        <FastImage
          source={{ uri: imageurl }}
          style={{ flex: 1 }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </ReactNativeZoomableView>

      <View style={styles.backbuttoniconview}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name="md-chevron-back-circle-outline"
          color="white"
          style={{ marginLeft: 3 }}
          size={35}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  backbuttoniconview: {
    position: "absolute",
    top: 30,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: "black",
    alignItems: "center",
    borderRadius: 40,
    justifyContent: "center",
    alignContent: "center",
  },
});
