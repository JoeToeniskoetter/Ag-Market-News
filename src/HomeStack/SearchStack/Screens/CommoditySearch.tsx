import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Platform, FlatList} from 'react-native';
import {Text, SearchBar, ListItem} from '@rneui/base';
import analytics from '@react-native-firebase/analytics';

import {useSearch} from '../../../Providers/SearchProvider';
import {Commodity} from '../../../shared/types';
import {
  LoadingSpinner,
  LoadingView,
} from '../../sharedComponents/LoadingSpinner';
import {NoResults} from './components/NoResults';
import {AnalyticEvents} from '../../../shared/util';
import {RetryFetch} from '../../sharedComponents/RetryFetch';

interface CommoditySearchProps {}

export const CommoditySearchScreen: React.FC<CommoditySearchProps> = () => {
  const {commodities, getCommodities, loading} = useSearch();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCommodities, setFilteredCommodities] = useState<
    Commodity[] | null
  >();
  const navigation = useNavigation();

  useEffect(() => {
    if (!commodities) {
      getCommodities();
    }
  }, []);

  const updateList = (term: string) => {
    setSearchText(term);
    if (term === '') {
      setFilteredCommodities(null);
      return;
    }
    const filtered = commodities?.filter((x: Commodity) => {
      return x.commodity_name.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredCommodities(filtered);
  };

  return (
    <LoadingView loading={loading}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Commodity Search
        </Text>
        <SearchBar
          placeholder="Enter a commodity..."
          platform={Platform.OS == 'ios' ? 'ios' : 'android'}
          clearIcon
          onChangeText={(text: string) => updateList(text)}
          value={searchText}
          onClear={() => updateList('')}
          onCancel={() => updateList('')}
        />
        {!loading && (!commodities || commodities?.length === 0) ? (
          <RetryFetch retryFunction={getCommodities} />
        ) : (
          <FlatList
            keyExtractor={(item: any) => item.commodity_lov_id}
            data={filteredCommodities ? filteredCommodities : commodities}
            renderItem={({item}) => (
              <ListItem
                bottomDivider
                onPress={() => {
                  analytics().logEvent(AnalyticEvents.commodity_search);
                  navigation.navigate('Reports', {
                    from: 'COMMODITY',
                    reportId: item.commodity_lov_id,
                  });
                }}>
                <ListItem.Content>
                  <ListItem.Title>{item.commodity_name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            )}
          />
        )}
      </View>
    </LoadingView>
  );
};
