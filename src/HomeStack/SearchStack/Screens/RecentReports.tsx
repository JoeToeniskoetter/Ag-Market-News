import React, {useState, useEffect} from 'react';
import {Report} from '../../../shared/types';
import firestore from '@react-native-firebase/firestore';
import {FlatList, Platform, RefreshControl, View} from 'react-native';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {Icon, ListItem, SearchBar, Text} from '@rneui/base';
import {useNavigation} from '@react-navigation/native';
import {AnalyticEvents} from '../../../shared/util';
import analytics from '@react-native-firebase/analytics';
import {RetryFetch} from '../../sharedComponents/RetryFetch';

export function RecentReports() {
  const [recentReportsLoading, setRecentReportsLoading] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigation = useNavigation();

  const getRecentReports = async (refresh: boolean = false) => {
    refresh ? setRefreshing(true) : setRecentReportsLoading(true);
    try {
      const reports = await firestore()
        .collection('reports')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get({source: 'server'});
      const data = reports.docs.map(doc => doc.data() as Report);
      setRecentReports(data);
    } catch (e: any) {
      console.log(e);
    }
    refresh ? setRefreshing(false) : setRecentReportsLoading(false);
  };

  const filterReports = () => {
    if (!searchTerm) {
      return recentReports;
    }

    if (searchTerm && searchTerm.trim() === '') {
      return recentReports;
    }

    return recentReports.filter(report => {
      return (
        report.report_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.slug_name.toLowerCase().includes(searchTerm)
      );
    });
  };

  useEffect(() => {
    getRecentReports();
  }, []);

  return (
    <LoadingView loading={recentReportsLoading}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Recent Reports
        </Text>
        <SearchBar
          placeholder="Enter a report name or slug..."
          platform={Platform.OS == 'ios' ? 'ios' : 'android'}
          clearIcon
          onChangeText={(text: string) => setSearchTerm(text)}
          value={searchTerm}
          onClear={() => setSearchTerm('')}
          onCancel={() => setSearchTerm('')}
        />
        {!recentReportsLoading &&
          (!recentReports || recentReports?.length === 0) && (
            <RetryFetch retryFunction={getRecentReports} />
          )}
        <FlatList
          contentContainerStyle={{backgroundColor: 'white'}}
          data={filterReports()}
          keyExtractor={report => report.slug_name}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getRecentReports(true)}
            />
          }
          renderItem={({item}) => {
            return (
              <ListItem
                bottomDivider
                onPress={() => {
                  analytics().logEvent(AnalyticEvents.recent_report_search);
                  navigation.navigate('PDFView', {report: item});
                }}>
                <Icon
                  name="file-text"
                  type="feather"
                  size={24}
                  color={'green'}
                />
                <ListItem.Content>
                  <ListItem.Title>{item.report_title}</ListItem.Title>
                  <ListItem.Subtitle
                    style={{fontWeight: 'bold'}}>{`Updated at: ${item.timestamp
                    .toDate()
                    .toUTCString()}`}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            );
          }}
        />
      </View>
    </LoadingView>
  );
}
