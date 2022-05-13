import React, {useState} from 'react';
import {View, Platform, FlatList, Alert} from 'react-native';
import {SearchBar, ListItem, Icon, Text} from '@rneui/base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useMyReports} from '../../../Providers/MyReportsProvider';
import {Report} from '../../../shared/types';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {useNavigation} from '@react-navigation/native';
import {RetryFetch} from '../../sharedComponents/RetryFetch';
import {useQuery} from 'react-query';
import {fetchReportsByName} from '../../../queries/reportsByname';
import {CustomBannerAdd} from './components/CustomBannerAd';

export function ReportSearchScreen() {
  const {data, isLoading, error, refetch} = useQuery<Report[], Error>(
    'reportsByName',
    fetchReportsByName,
  );
  const {addReport} = useMyReports();
  const [searchText, setSearchText] = useState<string>('');
  const navigation = useNavigation();
  const row: Array<any> = [];

  const RenderLeftActions: React.FC<{}> = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          backgroundColor: '#39bd28',
        }}>
        <FontAwesome name="star" size={24} color={'black'} />
        <Text>Favorite</Text>
      </View>
    );
  };

  return (
    <LoadingView loading={isLoading}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Report Name Search
        </Text>
        <SearchBar
          placeholder="Enter a report name..."
          platform={Platform.OS == 'ios' ? 'ios' : 'android'}
          clearIcon
          onChangeText={setSearchText}
          value={searchText}
          onClear={() => setSearchText('')}
          onCancel={() => setSearchText('')}
        />
        {error ? (
          <RetryFetch retryFunction={refetch} />
        ) : (
          <FlatList
            keyExtractor={(item: any) => item.slug_name}
            data={
              searchText.trim() !== ''
                ? data?.filter(
                    r =>
                      r.report_title
                        .toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                      r.slug_name
                        .toLowerCase()
                        .includes(searchText.toLowerCase()),
                  )
                : data
            }
            renderItem={({item, index}) => (
              <Swipeable
                ref={ref => (row[index] = ref)}
                renderLeftActions={() => <RenderLeftActions />}
                onSwipeableOpen={async () => {
                  row[index].close();
                  await addReport(item);
                  await Alert.alert('Saved to Favorites');
                }}>
                <ListItem
                  bottomDivider
                  onPress={() => {
                    navigation.navigate('PDFView', {report: item});
                  }}>
                  <Icon name="file-text" type="feather" size={24} />
                  <ListItem.Content>
                    <ListItem.Title style={{fontWeight: 'bold'}}>
                      {item.report_title}
                    </ListItem.Title>
                    <ListItem.Subtitle>{`Report ID: ${item.slug_name}`}</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </Swipeable>
            )}
          />
        )}
        <CustomBannerAdd />
      </View>
    </LoadingView>
  );
}
