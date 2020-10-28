import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Platform, ToastAndroid, Alert } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { ListItem, Text, SearchBar, Icon, ButtonGroup, Badge } from "react-native-elements";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { RemoveActionButton } from './components/RemoveActionButton';
import { SubscribeButton } from './components/SubscribeButton';
import { MyReportsContext, SavedReport } from "../../../Providers/MyReportsProvider";
import { Report } from '../../../Providers/SearchProvider';
import { MyReportsNavProps } from "../MyReportsStackParams";
import { NoSavedReports } from "../../SearchStack/Screens/components/NoSavedReports";
import { UnsubscribeButton } from './components/UnsubscribeButton';
import { SavedReports } from './components/SavedReports';


export function ReportsScreen({ navigation, route }: MyReportsNavProps<"Reports">) {
  const { getReports, subscribeToReport, unsubscribeToReport, storedReports, getNewlyPublishedReports } = useContext(MyReportsContext);
  const [savedReports, setSavedReports] = useState<Report[]>([])
  const [searchText, setSearchText] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState<Report[] | null>();
  const [buttonIndex, setButtonIndex] = useState<number>(0);

  const adUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8015316806136807/9105033552' : 'ca-app-pub-8015316806136807/4483084657';
  const row: Array<any> = [];

  async function load() {
    let rpts = await getReports();
    await setSavedReports(rpts as any);
  }

  function myReportsButton() {
    return (
      <Text style={{ color: buttonIndex == 0 ? 'white' : 'black' }}>
        MyReports
      </Text>
    )
  }
  function newReportsButton() {
    return (
      <Text style={{ color: buttonIndex == 1 ? 'white' : 'black' }}>
        New Reports 
        {storedReports.length > 0 ? <Badge value={storedReports.length} status="warning" /> : null}
      </Text>
    )
  }
  const buttons = [{ element: myReportsButton }, { element: newReportsButton }];

  async function changeSubscriptionStatus(savedReport: SavedReport) {
    let savedReportsCopy = savedReports.slice();

    for (let i = 0; i < savedReports.length; i++) {
      if ((savedReports[i].slug_name === savedReport.slug_name)) {
        //get current subscription status
        let curStatus = savedReports[i].subscribed;
        //setsubscription status to be the opposite of what is currently is
        savedReports[i].subscribed = !savedReports[i].subscribed

        //based on the status before changing it, call subscibe or unsubscribe
        if (curStatus) {
          unsubscribeToReport(savedReport);
        } else {
          subscribeToReport(savedReport);
        }
      }
    }
    setSavedReports(savedReportsCopy)
  }

  function filterReports(text: string) {
    setSearchText(text)

    if (text === '' || undefined) {
      return setFilteredReports(null)
    }
    const filtered = savedReports.filter((report: Report) => {
      return report.report_title.toLowerCase().includes(searchText.toLowerCase()) || report.slug_name.toLowerCase().includes(searchText.toLowerCase())
    });

    setFilteredReports(filtered);
  }

  async function leftSwipeAction(item:Report, index:number){
    if (item.subscribed) {
      await row[index].close()
      if (Platform.OS === "ios") {
        await Alert.alert(`Unsubscribed to ${item.slug_name}`)
      } else {
        await ToastAndroid.show(`Unsubscribed to ${item.slug_name}`, 500)
      }
      await changeSubscriptionStatus(item);
    } else {
      await row[index].close()
      if(Platform.OS === "ios"){
        await Alert.alert(`Subscribed to ${item.slug_name}`)
      }else {
        await ToastAndroid.show(`Subscribed to ${item.slug_name}`, 500)
      }
      await changeSubscriptionStatus(item);
    }
  }

  function getSelectedReportList(){
   if(buttonIndex == 0){
     return filteredReports ? filteredReports : savedReports
   }
   return storedReports
  }

  const focused = useIsFocused();

  useEffect(() => {
    load()
  }, [focused])

  return (
    <>
      <View style={styles.container}>
        <Text style={{ paddingLeft: '5%' }} h2>My Reports</Text>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <SearchBar
            placeholder="Search for report..."
            platform={Platform.OS == "ios" ? "ios" : "android"}
            clearIcon
            onChangeText={(text: string) => { filterReports(text) }}
            value={searchText}
            onClear={() => { filterReports('') }}
            onCancel={() => { filterReports('') }}
          />
          <ButtonGroup
            onPress={(index) => setButtonIndex(index)}
            selectedIndex={buttonIndex}
            buttons={buttons}
            selectedTextStyle={{ color: 'white' }}
          />
          {savedReports.length === 0 ? <NoSavedReports /> :
            <FlatList
              data={getSelectedReportList()}
              keyExtractor={item => item.slug_name}
              renderItem={({ item, index }) => (
                <Swipeable
                  ref={ref => row[index] = ref}
                  onSwipeableLeftOpen={() => leftSwipeAction(item, index)}
                  renderRightActions={() => (
                    <RemoveActionButton
                      item={item}
                      setSavedReports={setSavedReports}
                      savedReports={savedReports}
                    />
                  )}
                  renderLeftActions={() => (
                    item.subscribed ? <UnsubscribeButton /> : <SubscribeButton />
                  )}
                > 
                 <SavedReports
                    item={item}
                    navigation={navigation}
                  />
                </Swipeable>
              )}
            />
          }
        </View>
      </View>
      <View style={{ backgroundColor: 'white' }}>
        <BannerAd
          unitId={__DEV__ ? TestIds.BANNER : adUnitId}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={(e: any) => {
            console.log(e)
          }}
        />
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  card: {
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
    alignItems: 'flex-start',
  },
  icon: {
    width: 70,
    height: 70,
    marginLeft: '8%'
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: '15%',
    backgroundColor: 'white'
  },
  rightButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dd2c00',
    height: '100%',
    padding: 20
  },
  leftButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6ed1ff',
    height: '100%',
    padding: 20
  },
  actionText: {
    fontWeight: '600',
    color: '#fff',
  }
})