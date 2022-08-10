import {PortalProvider} from '@gorhom/portal';
import admob from '@invertase/react-native-google-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleIcons from 'react-native-vector-icons/SimpleLineIcons';
import {QueryClient, QueryClientProvider} from 'react-query';
import codePush from 'react-native-code-push';

import {HomeStack} from './src/HomeStack/HomeStack';
import {InstructionsScreen} from './src/HomeStack/InstructionsScreen';
import {CurrentReportProvider} from './src/Providers/CurrentReportProvider';
import {FirebaseAuthProvider} from './src/Providers/FirebaseAuthProvider';
import {MyReportsContextProvider} from './src/Providers/MyReportsProvider';
import {StorageReference} from './src/shared/StorageReference';

const queryClient = new QueryClient();

const App = () => {
  const [instructionsSeen, setInstructionsSeen] = useState<boolean>(false);

  const checkInstructionsSeen = async () => {
    const seen = await AsyncStorage.getItem(StorageReference.INSTRUCTIONS_SEEN);
    if (!seen) {
      return;
    }
    return setInstructionsSeen(true);
  };

  const onInstructionsSeen = async () => {
    //1 for seen, 0 for not seen
    await AsyncStorage.setItem(StorageReference.INSTRUCTIONS_SEEN, String(1));
    setInstructionsSeen(true);
  };

  useEffect(() => {
    codePush.sync();
  }, []);

  useEffect(() => {
    Promise.all([
      checkInstructionsSeen(),
      FontAwesome.loadFont(),
      AntDesign.loadFont(),
      EvilIcons.loadFont(),
      SimpleIcons.loadFont(),
      Ionicons.loadFont(),
      admob().initialize(),
    ]).then(() => {
      RNBootSplash.hide();
    });
  }, []);

  if (instructionsSeen) {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PortalProvider>
            <NavigationContainer>
              <FirebaseAuthProvider>
                <MyReportsContextProvider>
                  <CurrentReportProvider>
                    <HomeStack />
                  </CurrentReportProvider>
                </MyReportsContextProvider>
              </FirebaseAuthProvider>
            </NavigationContainer>
          </PortalProvider>
        </SafeAreaProvider>
        <Toast />
      </QueryClientProvider>
    );
  }

  return <InstructionsScreen onInstructionsSeen={onInstructionsSeen} />;
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
})(App);
