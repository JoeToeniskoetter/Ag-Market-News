/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import appName from './app.json';
import messaging from '@react-native-firebase/messaging';
import {AsyncStorage} from 'react-native';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const stored = await AsyncStorage.getItem('newlyPublishedReports');

  if (!stored) {
    console.log('NOTHING STORED');
    const newlyPublishedReports = [];
    newlyPublishedReports.push(remoteMessage.data.report);
    return AsyncStorage.setItem(
      'newlyPublishedReports',
      JSON.stringify(newlyPublishedReports),
    );
  } else {
    console.log('SAVED REPORTS', stored);
    const newlyPublishedReports = JSON.parse(stored);
    newlyPublishedReports.push(remoteMessage.data.report);
    return AsyncStorage.setItem(
      'newlyPublishedReports',
      JSON.stringify(newlyPublishedReports),
    );
  }
});

AppRegistry.registerComponent('Ag Market News', () => App);
