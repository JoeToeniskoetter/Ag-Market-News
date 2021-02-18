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

const App = () => {

  const [instructionsSeen, setInstructionsSeen] = useState<boolean>(false);


  const checkInstructionsSeen = async () => {
    const seen = await AsyncStorage.getItem('instructionsSeen');
    if (!seen) {
      return
    }
    return setInstructionsSeen(true);
  }

  const onInstructionsSeen = async () => {
    //1 for seen, 0 for not seen
    await AsyncStorage.setItem('instructionsSeen', String(1))
    setInstructionsSeen(true);
  }

  useEffect(() => {
    FontAwesome.loadFont();
    AntDesign.loadFont();
    EvilIcons.loadFont();
    SimpleIcons.loadFont();
    Ionicons.loadFont();
    checkInstructionsSeen()
    RNBootSplash.hide();
  }, [])

  if (instructionsSeen) {
    return (
      <NavigationContainer>
        <FirebaseAuthProvider>
          <MyReportsContextProvider>
            <SearchProvider>
              <HomeStack />
            </SearchProvider>
          </MyReportsContextProvider>
        </FirebaseAuthProvider>
      </NavigationContainer>
    )
  }

  return <InstructionsScreen onInstructionsSeen={onInstructionsSeen} />
};

export default App;