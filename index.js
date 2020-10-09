/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import appName from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent('Ag Market News', () => App);
