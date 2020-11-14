import React, { useState, useEffect, useContext } from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Text, SearchBar, ListItem } from 'react-native-elements';

import { SearchContext, Commodity } from '../../../Providers/SearchProvider';
import { Center } from './components/Center';
import { NoResults } from './components/NoResults';

interface CommoditySearchProps {
  navigation: any
}

export const CommoditySearchScreen: React.FC<CommoditySearchProps> = ({ navigation }) => {

  const { commodities, getCommodities, loading } = useContext(SearchContext);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCommodities, setFilteredCommodities] = useState<Commodity[] | null>();


  useEffect(() => {
    if (!commodities) {
      getCommodities()
    }
  }, []);

  const updateList = (term: string) => {
    setSearchText(term);
    if (term === '') {
      setFilteredCommodities(null)
      return;
    }
    const filtered = commodities?.filter((x: Commodity) => {
      return x.commodity_name.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredCommodities(filtered);
  }

  if (loading && !commodities) {
    return (
      <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
        <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Commodity Search</Text>
        <Center>
          <ActivityIndicator size="large" color="#000" />
        </Center>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
      <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Commodity Search</Text>
      <SearchBar
        placeholder="Enter a commodity..."
        platform={Platform.OS == "ios" ? "ios" : "android"}
        clearIcon
        onChangeText={(text: string) => updateList(text)}
        value={searchText}
        onClear={() => updateList('')}
        onCancel={() => updateList('')}
      />
      {!loading && commodities?.length === 0 ? <NoResults/> : 
      <FlatList
        keyExtractor={(item: any) => item.commodity_lov_id}
        data={filteredCommodities ? filteredCommodities : commodities}
        renderItem={({ item }) => <ListItem bottomDivider
          onPress={() => {
            navigation.navigate("Reports",
              { from: "COMMODITY", reportId: item.commodity_lov_id }
            )
          }}
          
        >
          <ListItem.Content>
            <ListItem.Title>{item.commodity_name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        }
      />
      }
    </View>
  );
}