import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Platform, FlatList, Alert} from 'react-native';
import {Text, SearchBar, ListItem} from '@rneui/base';
import analytics from '@react-native-firebase/analytics';
import {Commodity} from '../../../shared/types';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {AD_UNIT_ID, AnalyticEvents} from '../../../shared/util';
import {RetryFetch} from '../../sharedComponents/RetryFetch';
import {useQuery} from 'react-query';
import {fetchCommodities} from '../../../queries/commodities';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';
import {CustomBannerAdd} from './components/CustomBannerAd';

interface CommoditySearchProps {}

export const CommoditySearchScreen: React.FC<CommoditySearchProps> = () => {
  const {data, isLoading, error, refetch} = useQuery<Commodity[], Error>(
    'commodities',
    fetchCommodities,
  );
  const [searchText, setSearchText] = useState<string>('');
  const navigation = useNavigation();

  return (
    <LoadingView loading={isLoading}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Commodity Search
        </Text>
        <SearchBar
          placeholder="Enter a commodity..."
          platform={Platform.OS == 'ios' ? 'ios' : 'android'}
          clearIcon
          onChangeText={(text: string) => setSearchText(text)}
          value={searchText}
          onClear={() => setSearchText('')}
          onCancel={() => setSearchText('')}
        />
        {error ? (
          <RetryFetch retryFunction={refetch} />
        ) : (
          <FlatList
            keyExtractor={(item: any) => item.commodity_lov_id}
            data={
              searchText.trim() !== ''
                ? data?.filter(c =>
                    c.commodity_name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()),
                  )
                : data
            }
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
        <CustomBannerAdd />
      </View>
    </LoadingView>
  );
};
