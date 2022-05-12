import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Platform, FlatList} from 'react-native';
import {Text, SearchBar, ListItem} from '@rneui/base';
import analytics from '@react-native-firebase/analytics';

import {useSearch} from '../../../Providers/SearchProvider';
import {MarketType} from '../../../shared/types';
import {
  LoadingSpinner,
  LoadingView,
} from '../../sharedComponents/LoadingSpinner';
import {NoResults} from './components/NoResults';
import {AnalyticEvents} from '../../../shared/util';
import {RetryFetch} from '../../sharedComponents/RetryFetch';

export function MarketTypeSearch() {
  const {marketTypes, getMarketTypes, loading} = useSearch();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredMarketTypes, setFilteredMarketTypes] = useState<
    MarketType[] | null
  >();
  const navigation = useNavigation();

  useEffect(() => {
    if (!marketTypes) {
      getMarketTypes();
    }
  }, []);

  const updateList = (term: string) => {
    setSearchText(term);
    if (term === '') {
      setFilteredMarketTypes(null);
      return;
    }
    const filtered = marketTypes?.filter((x: MarketType) => {
      return x.market_type.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredMarketTypes(filtered);
  };

  return (
    <LoadingView loading={loading && !marketTypes}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Market Type Search
        </Text>
        <SearchBar
          placeholder="Enter a market type..."
          platform={Platform.OS == 'ios' ? 'ios' : 'android'}
          clearIcon
          onChangeText={(text: string) => updateList(text)}
          value={searchText}
          onClear={() => updateList('')}
          onCancel={() => updateList('')}
        />
        {!loading && (!marketTypes || marketTypes?.length === 0) ? (
          <RetryFetch retryFunction={getMarketTypes} />
        ) : (
          <FlatList
            keyExtractor={(item: MarketType) => item.market_type_id}
            data={filteredMarketTypes ? filteredMarketTypes : marketTypes}
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
      </View>
    </LoadingView>
  );
}
