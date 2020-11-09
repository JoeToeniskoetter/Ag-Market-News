/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import appName from './app.json';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

async function newReportAvailable(rpt){
  const subs = await AsyncStorage.getItem('subscriptions');  
  const subsToJson = await JSON.parse(subs);

  if(subsToJson.some(r => r.slug_name == rpt.slug_name)){
    return;
  }
  subsToJson.push(rpt);
  await AsyncStorage.setItem('subscriptions', JSON.stringify(subsToJson));
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if(!remoteMessage.data ||!remoteMessage.data.report){
    return;
  }
  newReportAvailable(JSON.parse(remoteMessage.data.report))
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent('Ag Market News', () => HeadlessCheck);
