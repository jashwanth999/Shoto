import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
export const takePhoto = async (navigation, navigateScreenName) => {
  if (Platform.OS === 'android') {
    const permission = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      permission['android.permission.CAMERA'] === 'granted' &&
      permission['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
      permission['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
    ) {
      const response = await lauchCamera();
      const result = await imageResize(response);
      if (response && result) {
        navigation.navigate(navigateScreenName, {
          mediumImage: result.uri,
          originalImage: response?.assets[0]?.uri,
          mediumImageName: result.name,
          originalImageName: response?.assets[0]?.uri.replace(/^.*[\\\/]/, ''),
        });
      }
    }
  }
};
const lauchCamera = () => {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  return new Promise((resolve, reject) => {
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
        Sentry.captureMessage(response.error);
      } else if (response.camera) {
      } else {
        resolve(response);
      }
    });
  });
};
const imageResize = async response => {
  try {
    const result = await ImageResizer.createResizedImage(
      response?.assets[0]?.uri,
      640,
      640,
      'JPEG',
      95,
      0,
      null,
      false,
      {mode: 'cover'},
    );
    return result;
  } catch (error) {
    Sentry.captureMessage(error.message);
  }
};
