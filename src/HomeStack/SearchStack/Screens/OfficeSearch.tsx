import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Platform, FlatList} from 'react-native';
import {Text, SearchBar, ListItem} from '@rneui/base';
import analytics from '@react-native-firebase/analytics';
import {Office} from '../../../shared/types';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {NoResults} from './components/NoResults';
import {AnalyticEvents} from '../../../shared/util';
import {RetryFetch} from '../../sharedComponents/RetryFetch';
import {useQuery} from 'react-query';
import {fetchOffices} from '../../../queries/offices';
import {CustomBannerAdd} from './components/CustomBannerAd';

export function OfficeSearchScreen() {
  const {data, isLoading, error, refetch} = useQuery<Office[], Error>(
    'offices',
    fetchOffices,
  );
  const [searchText, setSearchText] = useState<string>('');
  const navigation = useNavigation();

  return (
    <LoadingView loading={isLoading}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Office Search
        </Text>
        <SearchBar
          placeholder="Enter an office name..."
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
            keyExtractor={(item: any) => item.office_code}
            data={
              searchText.trim() !== ''
                ? data?.filter(c =>
                    c.office_name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()),
                  )
                : data
            }
            renderItem={({item}) => (
              <ListItem
                bottomDivider
                onPress={() => {
                  analytics().logEvent(AnalyticEvents.office_search);
                  navigation.navigate('Reports', {
                    from: 'OFFICE',
                    reportId: item.office_name,
                  });
                }}>
                <ListItem.Content>
                  <ListItem.Title>{item.office_name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            )}
          />
        )}
        <CustomBannerAdd />
      </View>
    </LoadingView>
  );
}
