import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, Platform, Alert } from "react-native";
import { ListItem, Text, SearchBar, ButtonGroup, Badge } from "react-native-elements";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MyReportsContext } from "../../../Providers/MyReportsProvider";
import { Report } from '../../../shared/types';
import { MyReportsNavProps } from "../MyReportsStackParams";
import { NoSavedReports } from "../../SearchStack/Screens/components/NoSavedReports";
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

export function ReportsScreen({ navigation, route }: MyReportsNavProps<"Reports">) {
  const { reports, removeReport, subscribeToReport, unsubscribeToReport } = useContext(MyReportsContext);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState<Report[] | null>();
  const [showAdd, setShowAdd] = useState<boolean>(true);
  const [buttonIndex, setButtonIndex] = useState<number>(0);
  const row: Array<any> = [];
  const adUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8015316806136807/9105033552' : 'ca-app-pub-8015316806136807/4483084657';


  const LeftActionButton: React.FC<{ item: Report }> = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await removeReport(item);
        }}
      >
        <View style={styles.rightButton}>
          <FontAwesome name="trash" size={24} color="white" />
          <Text style={styles.actionText}>Remove</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const RightActionButton: React.FC<{ item: Report }> = ({ item }) => {

    if (item.subscribed) {
      return (
        <TouchableOpacity>
          <View style={styles.unSubscribeButton}>
            <AntDesign name="closecircleo" size={22} color="white" />
            <Text style={styles.actionText}>Unsubscribe</Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity>
        <View style={styles.leftButton}>
          <AntDesign name="checkcircleo" size={22} color="black" />
          <Text style={styles.actionTextDark}>Subscribe</Text>
        </View>
      </TouchableOpacity>
    )
  }


  function filterReports(text: string) {
    setSearchText(text)

    if (text === '' || undefined) {
      return setFilteredReports(null)
    }
    const filtered = reports?.filter((report: Report) => {
      return report.report_title.toLowerCase().includes(searchText.toLowerCase()) || report.slug_name.toLowerCase().includes(searchText.toLowerCase())
    });

    setFilteredReports(filtered);
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={{ paddingLeft: '5%' }} h2>My Reports</Text>
        <SearchBar
          placeholder="Search for report..."
          platform={Platform.OS == "ios" ? "ios" : "android"}
          clearIcon
          onChangeText={(text: string) => { filterReports(text) }}
          value={searchText}
          onClear={() => { filterReports('') }}
          onCancel={() => { filterReports('') }}
          style={{ marginBottom: 0 }}
        />
        {reports?.length === 0 ? <NoSavedReports /> :
          <FlatList
            data={filteredReports ? filteredReports : reports}
            keyExtractor={item => item.slug_name}
            renderItem={({ item, index }) => (
              <Swipeable
                onSwipeableLeftOpen={async () => {
                  row[index].close()
                  if (item.subscribed) {
                    await unsubscribeToReport(item)
                  } else {
                    await subscribeToReport(item)
                    Alert.alert(`Subscribed to ${item.slug_name}`)
                  }
                }}
                ref={ref => row[index] = ref}
                renderRightActions={() => <LeftActionButton item={item} />}
                renderLeftActions={() => <RightActionButton item={item} />}
              >
                <ListItem bottomDivider
                  onPress={() => {
                    navigation.navigate("PDFView", { report: item })
                  }}
                >
                  {item.report_url?.includes('pdf') ? <AntDesign name="pdffile1" size={24} color={'black'} /> : <AntDesign name="filetext1" size={24} color={'black'} />
                  }
                  <ListItem.Content>
                    {item.subscribed ? <SubscribedText /> : null}
                    <ListItem.Title>{item.report_title}</ListItem.Title>
                    <ListItem.Subtitle style={{ fontWeight: 'bold' }}>{`Report ID: ${item.slug_name}`}</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </Swipeable>
            )}
          />
        }
      </View>
      {showAdd ?
        <View style={{ backgroundColor: 'white' }}>
          <BannerAd
            unitId={__DEV__ ? TestIds.BANNER : adUnitId}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(e: any) => {
              setShowAdd(false)
            }}
            onAdClosed={() => { }}
            onAdLoaded={() => {
              setShowAdd(true)
            }}
            onAdOpened={() => { }}
            onAdLeftApplication={() => { }}
          />
        </View>
        : null}
    </>
  )
}

const SubscribedText: React.FC<{}> = () => {
  return (
    <Text style={styles.subscribedText}>Subscribed <AntDesign name="checkcircleo" color="green" style={{ paddingRight: 3 }} />
    </Text>
  )
}


const styles = StyleSheet.create({
  leftButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#39bd28',
    height: '100%',
    padding: 20
  },
  unSubscribeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d2d6d3',
    height: '100%',
    padding: 20
  },
  subscribedText: {
    fontSize: 12,
    color: 'green',
    paddingRight: 2
  },
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
    justifyContent: 'flex-start',
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
  actionText: {
    fontWeight: '600',
    color: '#fff',
  },
  actionTextDark: {
    fontWeight: '600',
    color: 'black'
  }
})