import React, { useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator, Platform, FlatList } from 'react-native';
import { Text } from 'react-native-elements';

import { SearchContext, Report } from '../../../Providers/SearchProvider';
import { SearchBar, ListItem } from 'react-native-elements';
import { SearchNavProps } from '../SearchStackParams';
import { Center } from './components/Center';
import { NoResults } from './components/NoResults';

interface ReportSearchProps { }

export function ReportSearchScreen({ navigation, route }: SearchNavProps<"Reports">) {
  const { reportsForSearch, getReportsForSearch, loading } = useContext(SearchContext);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState<Report[] | null>();;


  useEffect(() => {
    if (!reportsForSearch) {
      getReportsForSearch()
    }
  }, []);

  const updateList = (term: string) => {
    setSearchText(term);
    if (term === '') {
      setFilteredReports(null)
      return;
    }
    const filtered = reportsForSearch?.filter((x: Report) => {
      return x.report_title.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredReports(filtered);
  }

  if (loading) {
    return (
      <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
        <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Report Name Search</Text>
        <Center>
          <ActivityIndicator size="large" color="#000" />
        </Center>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
      <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Report Name Search</Text>
      <SearchBar
        placeholder="Enter a report name..."
        platform={Platform.OS == "ios" ? "ios" : "android"}
        clearIcon
        onChangeText={(text: string) => updateList(text)}
        value={searchText}
        onClear={() => updateList('')}
        onCancel={() => updateList('')}
      />
      {!loading && reportsForSearch?.length === 0 ? <NoResults /> :
        <FlatList
          keyExtractor={(item: any) => item.slug_name}
          data={filteredReports ? filteredReports : reportsForSearch}
          renderItem={({ item }) => <ListItem bottomDivider
            onPress={() => {
              navigation.navigate("PDFView", { report: item })
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{item.report_title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          }
        />
      }
    </View>
  )
}