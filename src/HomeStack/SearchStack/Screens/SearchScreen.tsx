import React, { useEffect, useState } from 'react';
import { SearchNavProps } from '../SearchStackParams';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions, Platform, Alert } from 'react-native';
import { Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import messaging from '@react-native-firebase/messaging';
import { Report } from '../../../shared/types';
import analytics from '@react-native-firebase/analytics';
import { AD_UNIT_ID, AnalyticEvents } from '../../../shared/util';

export function SearchScreen({ navigation, route }: SearchNavProps<"Reports">) {
  const [showAd, setShowAd] = useState<boolean>(true)


  const goToReportOnNotification = async () => {
    const notif = await messaging().getInitialNotification()
    if (notif && notif.data && notif.data.report) {
      navigation.navigate("PDFView", { report: JSON.parse(notif.data.report) })
    }
  }

  useEffect(() => {
    goToReportOnNotification()
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
      // console.log('notification opened app', remoteMessage)
      if (!remoteMessage.data || !remoteMessage.data.report) {
        return;
      }
      navigation.navigate("PDFView", { report: JSON.parse(remoteMessage.data.report) })
    })

    return unsubscribe;
  }, [])


  return (
    <>
      <View style={styles.container}>
        <Text h2>Search By</Text>
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
                <Text style={styles.searchCategoryText}>Commodity</Text>
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
                <Text style={styles.searchCategoryText}>Office</Text>
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
                <Text style={styles.searchCategoryText}>Market Type</Text>
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
                <Text style={styles.searchCategoryText}>Report Name</Text>
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
    </>
  )
}


const styles = StyleSheet.create({
  card: {
    minHeight: 75,
    height: '20%',
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