import Toast from 'react-native-toast-message';
import React, {useEffect, useRef, useState} from 'react';
import {SearchNavProps} from '../SearchStackParams';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Button, Text} from '@rneui/base';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {Report} from '../../../shared/types';
import {AD_UNIT_ID, Colors} from '../../../shared/util';
import BottomSheet from 'reanimated-bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {useMyReports} from '../../../Providers/MyReportsProvider';
import {SearchInput} from '../components/SearchInput';
import {Divider} from '../components/Divider';
import {Icon} from '@rneui/themed';
import {StyledText, TextType} from '../../../shared/components/Text';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useRecentReports} from '../../../hooks/useRecentReports';
import {useQuery} from 'react-query';
import {fetchReports} from '../../../queries/reports';
import {fetchCategoryItems} from '../../../queries/categoryItems';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';

export function SearchScreen({route}: SearchNavProps<'SearchType'>) {
  const navigation = useNavigation();
  const {fetchNewReports} = useMyReports();
  const [searchText, setSearchText] = useState<string>('');
  const {
    recentReports,
    recentReportsLoading,
    refreshing,
    getRecentReports,
  } = useRecentReports();
  const {data, isLoading} = useQuery<{name: string; id: string}[]>(
    'reports',
    () => fetchCategoryItems('reports'),
  );
  console.log(data);

  const searchSelections = [
    {
      name: 'Commodity',
      icon: require('../../../../assets/icons/Commodity.png'),
      key: 'commodities',
    },
    {
      name: 'Market',
      icon: require('../../../../assets/icons/Market.png'),
      key: 'markets',
    },
    {
      name: 'Location',
      icon: require('../../../../assets/icons/Location.png'),
      key: 'offices',
    },
  ];

  const goToReportOnNotification = async () => {
    const notif = await messaging().getInitialNotification();
    if (notif && notif.data && notif.data.report) {
      navigation.navigate('PDFView', {report: JSON.parse(notif.data.report)});
    }
  };

  useEffect(() => {
    goToReportOnNotification();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (!remoteMessage.data || !remoteMessage.data.report) {
        return;
      } else {
        let report: Report = JSON.parse(remoteMessage.data.report);
        // await fetchNewReports();
        Toast.show({
          text1: 'New Report Available',
          text2: `${report.report_title} Saved to Favorites`,
          visibilityTime: 1500,
          onPress: () => navigation.navigate('PDFView', {report}),
        });
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

  return (
    <View style={styles.container}>
      <SearchInput
        onChange={setSearchText}
        onClear={() => {}}
        value={searchText}
      />
      {searchText && data ? (
        <View
          style={{
            zIndex: 1,
            flex: 1,
            maxHeight: 400,
            shadowColor: '#000000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.4,
            shadowRadius: 2,
            elevation: 1,
            position: 'absolute',
            top: 70,
            alignSelf: 'center',
            width: '92%',
          }}>
          <FlatList
            style={{
              padding: 10,
              backgroundColor: 'white',
            }}
            data={data.filter((i: {name: string; id: string}) =>
              i.name.toLowerCase().includes(searchText.toLowerCase()),
            )}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <View>
                  <TouchableOpacity
                    style={{padding: 5}}
                    onPress={() =>
                      navigation.navigate('PDFView', {report: item})
                    }>
                    <StyledText value={item.name} type={TextType.HEADING} />
                  </TouchableOpacity>
                  <Divider />
                </View>
              );
            }}
            ListEmptyComponent={
              <StyledText
                value={'No Results Found'}
                type={TextType.SMALL_HEADING}
              />
            }
          />
        </View>
      ) : null}
      <Divider />
      <View style={styles.row}>
        <Icon
          name="grid"
          type="feather"
          color={Colors.PRIMARY}
          size={18}
          style={{paddingRight: 10}}
        />
        <StyledText value="Browse By Category" type={TextType.HEADING} />
      </View>
      <View
        style={[
          styles.row,
          {justifyContent: 'space-evenly', marginBottom: 10},
        ]}>
        {searchSelections.map(selection => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ListScreen', {category: selection.key})
              }
              style={styles.searchSelection}
              key={selection.name}>
              <Image source={selection.icon} />
              <StyledText
                type={TextType.SMALL_HEADING}
                value={selection.name}
                style={{marginTop: 10}}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <Divider />
      <View style={styles.row}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="signal-variant"
            type="material-community"
            color={Colors.PRIMARY}
            size={20}
            style={{paddingRight: 10}}
          />
          <StyledText value="Latest Reports" type={TextType.HEADING} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <StyledText
            value="View All"
            type={TextType.SUB_HEADING}
            style={{textDecorationLine: 'underline', paddingRight: 12}}
            onPress={() => {
              navigation.navigate('ListScreen', {category: 'reports'});
            }}
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 10}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => getRecentReports(true)}
          />
        }>
        <LoadingView loading={recentReportsLoading}>
          {recentReports.slice(0, 3).map(report => (
            <TouchableOpacity
              style={styles.latestReportSelection}
              key={report.slug_id}
              onPress={() => navigation.navigate('PDFView', {report})}>
              <StyledText
                type={TextType.SMALL_HEADING}
                value={report.report_title}
              />
              <StyledText
                type={TextType.SUB_HEADING}
                value={`Last Updated: ${report.published_date}`}
              />
            </TouchableOpacity>
          ))}
        </LoadingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
  },
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  searchSelection: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '30%',
    backgroundColor: 'white',
    paddingVertical: 30,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  latestReportSelection: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 20,
    margin: 5,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
