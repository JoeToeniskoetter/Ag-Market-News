import React, { useState, useEffect, useContext } from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Text, SearchBar, ListItem } from 'react-native-elements';

import { useSearch } from '../../../Providers/SearchProvider';
import { MarketType } from '../../../shared/types';
import { SearchNavProps } from '../SearchStackParams';
import { Center } from './components/Center';
import { NoResults } from './components/NoResults';

export function MarketTypeSearch({ navigation, route }: SearchNavProps<"Reports">) {

  const { marketTypes, getMarketTypes, loading } = useSearch();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredMarketTypes, setFilteredMarketTypes] = useState<MarketType[] | null>();;


  useEffect(() => {
    if (!marketTypes) {
      getMarketTypes()
    }
  }, []);

  const updateList = (term: string) => {
    setSearchText(term);
    if (term === '') {
      setFilteredMarketTypes(null)
      return;
    }
    const filtered = marketTypes?.filter((x: MarketType) => {
      return x.market_type.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredMarketTypes(filtered);
  }

  if (loading && !marketTypes) {
    return (
      <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
        <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Market Type Search</Text>
        <Center>
          <ActivityIndicator size="large" color="#000" />
        </Center>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
      <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Market Type Search</Text>
      <SearchBar
        placeholder="Enter a market type..."
        platform={Platform.OS == "ios" ? "ios" : "android"}
        clearIcon
        onChangeText={(text: string) => updateList(text)}
        value={searchText}
        onClear={() => updateList('')}
        onCancel={() => updateList('')}
      />
      {!loading && marketTypes?.length === 0 ? <NoResults /> :
        <FlatList
          keyExtractor={(item: MarketType) => item.market_type_id}
          data={filteredMarketTypes ? filteredMarketTypes : marketTypes}
          renderItem={({ item }) => <ListItem bottomDivider
            onPress={() => {
              navigation.navigate("Reports",
                { from: "MARKET_TYPE", reportId: item.market_type }
              )
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{item.market_type}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          }
        />
      }
    </View>
  );
}