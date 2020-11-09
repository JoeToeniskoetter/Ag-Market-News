import React, { useEffect, useRef, useState } from 'react';
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
import { SubscriptionProvider } from './src/Providers/SubscriptionProvider';
import { AppState } from 'react-native';

const App = () => {
  

  useEffect(() => {
    FontAwesome.loadFont();
    AntDesign.loadFont();
    EvilIcons.loadFont();
    SimpleIcons.loadFont();
    Ionicons.loadFont();
    SplashScreen.hide();
  }, [])


  return (
    <NavigationContainer>
      <SubscriptionProvider>
        <MyReportsContextProvider>
          <SearchProvider>
            <HomeStack />
          </SearchProvider>
        </MyReportsContextProvider>
      </SubscriptionProvider>
    </NavigationContainer>
  )
};

export default App;