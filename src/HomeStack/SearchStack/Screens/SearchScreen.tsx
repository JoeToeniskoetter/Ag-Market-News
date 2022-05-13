import React, {useEffect, useRef, useState} from 'react';
import {SearchNavProps} from '../SearchStackParams';
import {View, StyleSheet, Dimensions, Alert} from 'react-native';
import {Button, Text} from '@rneui/base';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';
import messaging from '@react-native-firebase/messaging';
import {Report} from '../../../shared/types';
import {AD_UNIT_ID} from '../../../shared/util';
import {StorageReference} from '../../../shared/StorageReference';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import {Column, Row} from '../../../shared/components/Layout';
import VersionCheck from 'react-native-version-check';
import CustomTabBarExample from './components/TextTabBar';
import {useNavigation} from '@react-navigation/native';

export function SearchScreen({route}: SearchNavProps<'Reports'>) {
  const [showAd, setShowAd] = useState<boolean>(true);
  // const [whatsNewSeen, setWhatsNewSeen] = useState<boolean>(true);
  const [currentVersion, setCurrentVersion] = useState<string>();
  const whatsNewSheetRef = useRef<BottomSheet>(null);
  const {height} = Dimensions.get('window');
  const navigation = useNavigation();

  // const sheetRef = useRef<BottomSheet>(null);
  // let fall = new Animated.Value(1);
  // const animatedShadowOpacity = Animated.interpolate(fall, {
  //   inputRange: [0, 1],
  //   outputRange: [0.5, 0],
  // });

  const goToReportOnNotification = async () => {
    const notif = await messaging().getInitialNotification();
    if (notif && notif.data && notif.data.report) {
      navigation.navigate('PDFView', {report: JSON.parse(notif.data.report)});
    }
  };

  // const checkWhatsNewSeen = async () => {
  //   if (__DEV__) {
  //     await AsyncStorage.removeItem(StorageReference.WHATS_NEW_SEEN);
  //   }
  //   const {currentVersion} = await VersionCheck.needUpdate();
  //   setCurrentVersion(currentVersion);
  //   const seen = await AsyncStorage.getItem(StorageReference.WHATS_NEW_SEEN);
  //   console.log(
  //     seen,
  //     currentVersion === JSON.parse(seen || '{}').currentVersion,
  //   );
  //   if (!seen || JSON.parse(seen).currentVersion !== currentVersion) {
  //     setWhatsNewSeen(false);
  //     return;
  //   }
  // };

  // const saveWhatsNewSeen = async () => {
  //   const {currentVersion} = await VersionCheck.needUpdate();
  //   await AsyncStorage.setItem(
  //     StorageReference.WHATS_NEW_SEEN,
  //     JSON.stringify({currentVersion, seen: true}),
  //   );
  // };

  useEffect(() => {
    goToReportOnNotification();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (!remoteMessage.data || !remoteMessage.data.report) {
        return;
      } else {
        let report: Report = JSON.parse(remoteMessage.data.report);
        Alert.alert(
          'New Report Available!',
          `${report.report_title}`,
          [
            {
              text: 'Open Report',
              onPress: () => navigation.navigate('PDFView', {report}),
            },
            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          ],
          {cancelable: true},
        );
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (!remoteMessage.data || !remoteMessage.data.report) {
        return;
      }
      navigation.navigate('PDFView', {
        report: JSON.parse(remoteMessage.data.report),
      });
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   checkWhatsNewSeen().then(() => {
  //     if (!whatsNewSeen) {
  //       whatsNewSheetRef.current?.snapTo(0);
  //     } else {
  //       whatsNewSheetRef.current?.snapTo(1);
  //     }
  //   });
  // }, [whatsNewSeen]);

  // const renderWhatsNewSheet = () => {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: 'white',
  //         height: height * 0.75,
  //         alignItems: 'center',
  //         justifyContent: 'flex-start',
  //         shadowColor: '#000',
  //         shadowOffset: {
  //           width: 0,
  //           height: 10,
  //         },
  //         zIndex: 1,
  //         shadowOpacity: 0.51,
  //         shadowRadius: 13.16,
  //         paddingTop: 20,
  //         elevation: 20,
  //       }}>
  //       <Column alignItems="center" justifyContent="flex-start">
  //         <Row alignItems="flex-end" justifyContent="flex-end">
  //           <Button
  //             style={{paddingRight: 40}}
  //             title="X Close"
  //             type="clear"
  //             onPress={() => whatsNewSheetRef.current?.snapTo(1)}
  //           />
  //         </Row>
  //         <Row alignItems="flex-start" justifyContent="flex-start">
  //           <Text h3 style={{paddingHorizontal: 15}}>
  //             What's new {currentVersion}
  //           </Text>
  //         </Row>
  //         <Row alignItems="center" justifyContent="flex-start">
  //           <Text h4 style={{marginHorizontal: 25}}>
  //             {`\u2022 Annonymous feature requests`}
  //           </Text>
  //         </Row>
  //         <Row alignItems="center" justifyContent="flex-start">
  //           <Text h4 style={{marginHorizontal: 25}}>
  //             {`\u2022 View report descriptions`}
  //           </Text>
  //         </Row>
  //         <Row alignItems="center" justifyContent="flex-start">
  //           <Text h4 style={{marginHorizontal: 25}}>
  //             {`\u2022 Search for previously released reports`}
  //           </Text>
  //         </Row>
  //       </Column>
  //     </View>
  //   );
  // };

  return (
    <>
      <CustomTabBarExample />
      {/* <BottomSheet
        callbackNode={fall}
        ref={whatsNewSheetRef}
        borderRadius={30}
        snapPoints={[height * 0.75, 0]}
        initialSnap={1}
        renderContent={renderWhatsNewSheet}
        onCloseEnd={saveWhatsNewSeen}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 75,
    height: '15%',
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  gradient: {
    height: '100%',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 70,
    height: 70,
    marginLeft: '8%',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: '10%',
    backgroundColor: 'white',
    padding: 15,
    height: Dimensions.get('screen').height,
  },
  searchCategoryText: {
    fontSize: Dimensions.get('window').width / 10,
    fontWeight: 'bold',
  },
});
