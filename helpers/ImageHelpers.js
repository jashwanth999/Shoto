import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

export const getImages = async () => {
  const permissions = await getPermissions();
  if (permissions) {
    const orginalImageResponse = await getCameraImage();
    const mediumImageResponse = await imageResize(orginalImageResponse);
    return {
      mediumImage: mediumImageResponse.uri,
      originalImage: orginalImageResponse?.assets[0]?.uri,
      mediumImageName: mediumImageResponse.name,
      originalImageName: orginalImageResponse?.assets[0]?.uri.replace(
        /^.*[\\\/]/,
        '',
      ),
    };
  } else {
    throw 'Insufficient Permissions';
  }
};

const getPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const permission = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        permission['android.permission.CAMERA'] === 'granted' &&
        permission['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
        permission['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
      );
    } catch (e) {
      return false;
    }
  } else {
    return true;
  }
};

const getCameraImage = () => {
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

const imageResize = async image => {
  return await ImageResizer.createResizedImage(
    image?.assets[0]?.uri,
    640,
    640,
    'JPEG',
    95,
    0,
    null,
    false,
    {mode: 'cover'},
  );
};


