import React, { useState, useEffect, useContext } from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Text, SearchBar, ListItem } from 'react-native-elements';

import { SearchContext, useSearch } from '../../../Providers/SearchProvider';
import { Office } from '../../../shared/types';
import { SearchNavProps } from '../SearchStackParams';
import { Center } from './components/Center';
import { NoResults } from './components/NoResults';

interface CommoditySearchProps {
  navigation: any
}

export function OfficeSearchScreen({ navigation, route }: SearchNavProps<"Reports">) {

  const { offices, getOffices, loading } = useSearch();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredOffices, setFilteredOffices] = useState<Office[] | null>();;


  useEffect(() => {
    if (!offices) {
      getOffices()
    }
  }, []);

  const updateList = (term: string) => {
    setSearchText(term);
    if (term === '') {
      setFilteredOffices(null)
      return;
    }
    const filtered = offices?.filter((x: Office) => {
      return x.office_name.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredOffices(filtered);
  }

  if (loading && !offices) {
    return (
      <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
        <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Office Search</Text>
        <Center>
          <ActivityIndicator size="large" color="#000" />
        </Center>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
      <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Office Search</Text>
      <SearchBar
        placeholder="Enter an office name..."
        platform={Platform.OS == "ios" ? "ios" : "android"}
        clearIcon
        onChangeText={(text: string) => updateList(text)}
        value={searchText}
        onClear={() => updateList('')}
        onCancel={() => updateList('')}
      />
      {!loading && offices?.length === 0 ? <NoResults /> :
        <FlatList
          keyExtractor={(item: any) => item.office_code}
          data={filteredOffices ? filteredOffices : offices}
          renderItem={({ item }) => <ListItem bottomDivider
            onPress={() => {
              navigation.navigate("Reports",
                { from: "OFFICE", reportId: item.office_name }
              )
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{item.office_name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          }
        />
      }
    </View>
  );
}