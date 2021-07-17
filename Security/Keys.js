import auth from '@react-native-firebase/auth';
const currentUser = auth().currentUser;
export const kEYPREFIX = `uploads/${currentUser.uid}/`;
export const BUCKETNAMEONE = 'shoto-resized-production';
export const BUCKETNAMETWO = 'shotoclick';
export const REGION = 'ap-south-1';
export const ACCESSKEY = 'AKIAR77UFFI6JWKBCVUU';
export const SECRETKEY = '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';
export const WEBCLIENTID =
  '821295087358-f7nsmu3rup0ghfflnvk7ret61mv49gec.apps.googleusercontent.com';
export const APIKEY = 'AIzaSyBJFyW2KfP5Uo0E3gyYzFJ5W2LDGJnciXo';
export const AUTHDOMAIN = 'shotography-6a40e.firebaseapp.com';
export const PROJECTID = 'shotography-6a40e';
export const STORAGEBUCKET = 'shotography-6a40e.appspot.com';
export const MESSAGINGSENDERID = '821295087358';
export const APPID = '1:821295087358:web:0a97e8bffbb5add9d06faf';
export const MEASUREMENTID = 'G-MM7V9R0R3X';
export const DATABASEURL =
  'https://shotography-6a40e-default-rtdb.firebaseio.com/';
