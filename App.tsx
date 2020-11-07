import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStack } from './src/HomeStack/HomeStack';
import { MyReportsContextProvider } from './src/Providers/MyReportsProvider';
import { SearchProvider } from './src/Providers/SearchProvider';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import SimpleIcons from 'react-native-vector-icons/SimpleLineIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging'
import { Alert } from 'react-native';



const App = () => {


  async function setUpMessaging(){
    const permissionResult = await messaging().requestPermission();
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    FontAwesome.loadFont();
    AntDesign.loadFont();
    EvilIcons.loadFont();
    SimpleIcons.loadFont();
    Ionicons.loadFont();
    SplashScreen.hide();

    return unsubscribe;
  }, [])

  return (
    <NavigationContainer>
      <MyReportsContextProvider>
        <SearchProvider>
          <HomeStack />
        </SearchProvider>
      </MyReportsContextProvider>
    </NavigationContainer>
  )
};

export default App;