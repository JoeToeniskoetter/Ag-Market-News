import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Platform, FlatList} from 'react-native';
import {Text, SearchBar, ListItem} from '@rneui/base';
import analytics from '@react-native-firebase/analytics';
import {MarketType} from '../../../shared/types';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {AnalyticEvents} from '../../../shared/util';
import {RetryFetch} from '../../sharedComponents/RetryFetch';
import {useQuery} from 'react-query';
import {fetchMarketTypes} from '../../../queries/marketTypes';
import {CustomBannerAdd} from './components/CustomBannerAd';

export function MarketTypeSearch() {
  const {data, isLoading, error, refetch} = useQuery<MarketType[], Error>(
    'marketTypes',
    fetchMarketTypes,
  );
  const [searchText, setSearchText] = useState<string>('');
  const navigation = useNavigation();

  return (
    <LoadingView loading={isLoading}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Market Type Search
        </Text>
        <SearchBar
          placeholder="Enter a market type..."
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
            keyExtractor={(item: MarketType) => item.market_type_id}
            data={
              searchText.trim() !== ''
                ? data?.filter(m =>
                    m.market_type
                      .toLowerCase()
                      .includes(searchText.toLowerCase()),
                  )
                : data
            }
            renderItem={({item}) => (
              <ListItem
                bottomDivider
                onPress={() => {
                  analytics().logEvent(AnalyticEvents.market_type_search);
                  navigation.navigate('Reports', {
                    from: 'MARKET_TYPE',
                    reportId: item.market_type,
                  });
                }}>
                <ListItem.Content>
                  <ListItem.Title>{item.market_type}</ListItem.Title>
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
