import React, { useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator, Platform, FlatList, Alert } from 'react-native';
import { Text } from 'react-native-elements';

import { SearchContext, useSearch } from '../../../Providers/SearchProvider';
import { SearchBar, ListItem } from 'react-native-elements';
import { SearchNavProps } from '../SearchStackParams';
import { Center } from './components/Center';
import { NoResults } from './components/NoResults';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MyReportsContext, useMyReports } from '../../../Providers/MyReportsProvider';
import { Report } from '../../../shared/types';

interface ReportSearchProps { }

export function ReportSearchScreen({ navigation, route }: SearchNavProps<"Reports">) {
  const { reportsForSearch, getReportsForSearch, loading } = useSearch();
  const { addReport } = useMyReports();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState<Report[] | null>();;
  const row: Array<any> = [];

  useEffect(() => {
    if (!reportsForSearch) {
      getReportsForSearch()
    }
  }, []);

  const RenderLeftActions: React.FC<{}> = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#39bd28' }}>
        <FontAwesome name="star" size={24} color={"black"} />
        <Text>Favorite</Text>
      </View>
    )
  }

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

  if (loading && !reportsForSearch) {
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
          renderItem={({ item, index }) => <Swipeable
            ref={ref => row[index] = ref}
            renderLeftActions={() => <RenderLeftActions />}
            onSwipeableOpen={async () => {
              row[index].close()
              await addReport(item)
              await Alert.alert('Saved to Favorites')
            }}
          >
            <ListItem bottomDivider
              onPress={() => {
                navigation.navigate("PDFView", { report: item })
              }}
            >
              <ListItem.Content>
                <ListItem.Title style={{ fontWeight: 'bold' }}>
                  {item.report_title}
                </ListItem.Title>
                <ListItem.Subtitle>{`Report ID: ${item.slug_name}`}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Swipeable>
          }
        />
      }
    </View>
  )
}