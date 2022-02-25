import React, { useEffect, useRef, useState } from 'react';
import { SearchNavProps } from '../SearchStackParams';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, FlexStyle, FlexAlignType } from 'react-native';
import { Button, Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { BannerAd, BannerAdSize, TestIds } from '@invertase/react-native-google-ads';
import messaging from '@react-native-firebase/messaging';
import { Report } from '../../../shared/types';
import analytics from '@react-native-firebase/analytics';
import { AD_UNIT_ID, AnalyticEvents } from '../../../shared/util';
import { StorageReference } from '../../../shared/StorageReference';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from "react-native-reanimated";
import { Column, Row } from '../../../shared/components/Layout';
import VersionCheck from 'react-native-version-check';

export function SearchScreen({ navigation, route }: SearchNavProps<"Reports">) {
  const [showAd, setShowAd] = useState<boolean>(true);
  const [whatsNewSeen, setWhatsNewSeen] = useState<boolean>(true);
  const [currentVersion, setCurrentVersion] = useState<string>();
  const whatsNewSheetRef = useRef<BottomSheet>(null);
  const { height, width } = Dimensions.get('window');

  const sheetRef = useRef<BottomSheet>(null);
  let fall = new Animated.Value(1);
  const animatedShadowOpacity = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  const goToReportOnNotification = async () => {
    const notif = await messaging().getInitialNotification()
    if (notif && notif.data && notif.data.report) {
      navigation.navigate("PDFView", { report: JSON.parse(notif.data.report) })
    }
  }

  const checkWhatsNewSeen = async () => {
    if (__DEV__) {
      await AsyncStorage.removeItem(StorageReference.WHATS_NEW_SEEN);
    }
    const { currentVersion } = await VersionCheck.needUpdate();
    setCurrentVersion(currentVersion);
    const seen = await AsyncStorage.getItem(StorageReference.WHATS_NEW_SEEN);
    console.log(seen, currentVersion === JSON.parse(seen || '{}').currentVersion)
    if (!seen || JSON.parse(seen).currentVersion !== currentVersion) {
      setWhatsNewSeen(false);
      return;
    }
  }

  const saveWhatsNewSeen = async () => {
    const { currentVersion } = await VersionCheck.needUpdate();
    await AsyncStorage.setItem(StorageReference.WHATS_NEW_SEEN, JSON.stringify({ currentVersion, seen: true }))
  }

  useEffect(() => {
    goToReportOnNotification();
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (!remoteMessage.data || !remoteMessage.data.report) {
        return;
      } else {
        let report: Report = JSON.parse(remoteMessage.data.report)
        Alert.alert("New Report Available!", `${report.report_title}`, [
          { text: 'Open Report', onPress: () => navigation.navigate("PDFView", { report }) },
          { text: 'Cancel', onPress: () => { }, style: 'cancel' }
        ],
          { cancelable: true }
        )
      }
    })
    return unsubscribe;
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      if (!remoteMessage.data || !remoteMessage.data.report) {
        return;
      }
      navigation.navigate("PDFView", { report: JSON.parse(remoteMessage.data.report) })
    })

    return unsubscribe;
  }, [])


  useEffect(() => {
    checkWhatsNewSeen().then(() => {
      if (!whatsNewSeen) {
        whatsNewSheetRef.current?.snapTo(0);
      } else {
        whatsNewSheetRef.current?.snapTo(1);
      }
    })
  }, [whatsNewSeen])

  const renderWhatsNewSheet = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: height * .75,
          alignItems: 'center',
          justifyContent: 'flex-start',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          zIndex: 1,
          shadowOpacity: 0.51,
          shadowRadius: 13.16,
          paddingTop: 20,
          elevation: 20,
        }}
      >
        <Column alignItems="center" justifyContent="flex-start">
          <Row alignItems="flex-end" justifyContent="flex-end">
            <Button style={{ paddingRight: 40 }} title="X Close" type="clear" onPress={() => whatsNewSheetRef.current?.snapTo(1)} />
          </Row>
          <Row alignItems="flex-start" justifyContent="flex-start">
            <Text h3 style={{ paddingHorizontal: 15 }}>
              What's new {currentVersion}
            </Text>
          </Row>
          <Row alignItems="center" justifyContent="flex-start">
            <Text h4 style={{ marginHorizontal: 25 }}>
              {`\u2022 Annonymous feature requests`}
            </Text>
          </Row>
          <Row alignItems="center" justifyContent="flex-start">
            <Text h4 style={{ marginHorizontal: 25 }}>
              {`\u2022 View report descriptions`}
            </Text>
          </Row>
          <Row alignItems="center" justifyContent="flex-start">
            <Text h4 style={{ marginHorizontal: 25 }}>
              {`\u2022 Search for previously released reports`}
            </Text>
          </Row>
        </Column>
      </View >
    )
  }


  return (
    <>
      <View style={styles.container}>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "#000",
              opacity: animatedShadowOpacity,
            },
          ]}
        />
        <Text dataDetectorType={undefined} h2>Search By</Text>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', width: '100%' }}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#FFCC00' }]}
            onPress={async () => {
              navigation.navigate("CommoditySearch")
              await analytics().logEvent(AnalyticEvents.commodity_search)
            }}
          >
            <LinearGradient
              colors={['#FFCC00', '#FFEC9E']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/wheat.png")}
                style={styles.icon}
              />
              <View style={{ width: '80%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text dataDetectorType={undefined} style={styles.searchCategoryText}>Commodity</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={async () => {
              navigation.navigate("OfficeSearch")
              await analytics().logEvent(AnalyticEvents.office_search)
            }}

          >
            <LinearGradient
              colors={['#B75902', '#F3B983']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/company.png")}
                style={styles.icon}
              />
              <View style={{ width: '70%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text dataDetectorType={undefined} style={styles.searchCategoryText}>Office</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={async () => {
              navigation.navigate("MartketTypeSearch")
              await analytics().logEvent(AnalyticEvents.market_type_search)
            }}
          >
            <LinearGradient
              colors={['#47B702', '#92DD91']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/market.png")}
                style={styles.icon}
              />
              <View style={{ width: '70%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text dataDetectorType={undefined} style={styles.searchCategoryText}>Market Type</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#EB5959' }]}
            onPress={async () => {
              navigation.navigate('ReportNameSearch')
              await analytics().logEvent(AnalyticEvents.report_name_search)
            }}

          >
            <LinearGradient
              colors={['#EB5959', '#F1A2A2']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/003-newspaper.png")}
                style={styles.icon}
              />
              <View style={{ width: '70%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text dataDetectorType={undefined} style={styles.searchCategoryText}>Report Name</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#EB5959' }]}
            onPress={async () => {
              navigation.navigate('RecentReports')
              await analytics().logEvent(AnalyticEvents.report_name_search)
            }}

          >
            <LinearGradient
              colors={['#3596e6', '#60a9e6']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/clock.png")}
                style={styles.icon}
              />
              <View style={{ width: '70%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text dataDetectorType={undefined} style={styles.searchCategoryText}>Recent</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      {showAd ?
        <View style={{ backgroundColor: 'white' }}>
          <BannerAd
            unitId={__DEV__ ? TestIds.BANNER : AD_UNIT_ID}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: false,
            }}
            onAdFailedToLoad={(e: any) => {
              console.log(e)
              setShowAd(false);
            }}
            onAdClosed={() => { }}
            onAdLoaded={() => {
              setShowAd(true)
            }}
            onAdOpened={() => { }}
            onAdLeftApplication={() => { }}
          />
        </View>
        : null}
      <BottomSheet
        callbackNode={fall}
        ref={whatsNewSheetRef}
        borderRadius={30}
        snapPoints={[height * .75, 0]}
        initialSnap={1}
        renderContent={renderWhatsNewSheet}
        onCloseEnd={saveWhatsNewSeen}
      />
    </>
  )
}


const styles = StyleSheet.create({
  card: {
    minHeight: 75,
    height: '15%',
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
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
    marginLeft: '8%'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: '10%',
    backgroundColor: 'white',
    padding: 15,
    height: Dimensions.get('screen').height
  },
  searchCategoryText: {
    fontSize: Dimensions.get('window').width / 10,
    fontWeight: 'bold'
  }
})