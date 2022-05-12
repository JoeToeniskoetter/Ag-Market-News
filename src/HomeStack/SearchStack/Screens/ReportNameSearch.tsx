import React, {useState, useEffect} from 'react';
import {View, Platform, FlatList, Alert} from 'react-native';

import {useSearch} from '../../../Providers/SearchProvider';
import {SearchBar, ListItem, Icon, Text} from '@rneui/base';
import {NoResults} from './components/NoResults';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useMyReports} from '../../../Providers/MyReportsProvider';
import {Report} from '../../../shared/types';
import {
  LoadingSpinner,
  LoadingView,
} from '../../sharedComponents/LoadingSpinner';
import {useNavigation} from '@react-navigation/native';
import {RetryFetch} from '../../sharedComponents/RetryFetch';

interface ReportSearchProps {}

export function ReportSearchScreen() {
  const {reportsForSearch, getReportsForSearch, loading} = useSearch();
  const {addReport} = useMyReports();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState<Report[] | null>();
  const navigation = useNavigation();
  const row: Array<any> = [];

  useEffect(() => {
    if (!reportsForSearch) {
      getReportsForSearch();
    }
  }, []);

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

  const updateList = (term: string) => {
    setSearchText(term);
    if (term === '') {
      setFilteredReports(null);
      return;
    }
    const filtered = reportsForSearch?.filter((x: Report) => {
      return x.report_title.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredReports(filtered);
  };

  return (
    <LoadingView loading={loading}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Report Name Search
        </Text>
        <SearchBar
          placeholder="Enter a report name..."
          platform={Platform.OS == 'ios' ? 'ios' : 'android'}
          clearIcon
          onChangeText={(text: string) => updateList(text)}
          value={searchText}
          onClear={() => updateList('')}
          onCancel={() => updateList('')}
        />
        {!loading && (!reportsForSearch || reportsForSearch?.length === 0) ? (
          <RetryFetch retryFunction={getReportsForSearch} />
        ) : (
          <FlatList
            keyExtractor={(item: any) => item.slug_name}
            data={filteredReports ? filteredReports : reportsForSearch}
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
      </View>
    </LoadingView>
  );
}
