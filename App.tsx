import React, { useEffect, useState } from 'react';
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
import RNBootSplash from "react-native-bootsplash";
import { InstructionsScreen } from './src/HomeStack/InstructionsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseAuthProvider } from './src/Providers/FirebaseAuthProvider';
import VersionCheck from 'react-native-version-check';
import { Alert, BackHandler, Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-elements';
import { StorageReference } from './src/shared/StorageReference';
import admob from '@invertase/react-native-google-ads';

const App = () => {

  const [instructionsSeen, setInstructionsSeen] = useState<boolean>(false);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);


  const checkInstructionsSeen = async () => {
    const seen = await AsyncStorage.getItem(StorageReference.INSTRUCTIONS_SEEN);
    if (!seen) {
      return
    }
    return setInstructionsSeen(true);
  }

  const checkNeedsUpdate = async () => {
    const { storeUrl, isNeeded } = await VersionCheck.needUpdate();
    if (isNeeded) {
      setNeedsUpdate(true);
      Alert.alert("Please Update", "You will need to update this app to continue using", [
        {
          text: "Update",
          onPress: () => {
            BackHandler.exitApp();
            Linking.openURL(storeUrl)
          }
        },
      ],
        { cancelable: false })
    }
  }

  const onInstructionsSeen = async () => {
    //1 for seen, 0 for not seen
    await AsyncStorage.setItem(StorageReference.INSTRUCTIONS_SEEN, String(1))
    setInstructionsSeen(true);
  }

  useEffect(() => {
    Promise.all([
      checkNeedsUpdate(),
      checkInstructionsSeen(),
      FontAwesome.loadFont(),
      AntDesign.loadFont(),
      EvilIcons.loadFont(),
      SimpleIcons.loadFont(),
      Ionicons.loadFont(),
      admob().initialize()
    ]).then(() => {
      if (!needsUpdate) {
        RNBootSplash.hide();
      }
    })
  }, [])

  if (instructionsSeen && !needsUpdate) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <FirebaseAuthProvider>
              <MyReportsContextProvider>
                <SearchProvider>
                  <HomeStack />
                </SearchProvider>
              </MyReportsContextProvider>
            </FirebaseAuthProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    )
  }

  if (needsUpdate) {
    return null
  }

  return <InstructionsScreen onInstructionsSeen={onInstructionsSeen} />
};

export default App;