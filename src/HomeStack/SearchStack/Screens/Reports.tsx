import React, { useState, useContext, useEffect } from 'react';
import { SearchContext } from '../../../Providers/SearchProvider';
import { Text, SearchBar, ListItem } from 'react-native-elements';
import { View, ActivityIndicator, Platform, FlatList, Modal, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Center } from './components/Center';
import { SearchNavProps } from '../SearchStackParams';
import { MyReportsContext } from '../../../Providers/MyReportsProvider';
import { NoResults } from './components/NoResults';
import { Report } from '../../../shared/types';

interface IReportsScreen {
}

export function ReportScreen({ navigation, route }: SearchNavProps<"Reports">) {
  const { loading, reports, getReports } = useContext(SearchContext);
  const { addReport } = useContext(MyReportsContext)
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [filteredReports, setFilteredReports] = useState<Report[] | undefined>(undefined);


  useEffect(() => {
    const { from, reportId } = route.params;
    getReports({ from, reportId })

  }, []);

  const row: Array<any> = [];

  function updateReportList(term: string) {
    setSearchText(term);
    if (term === "") {
      setFilteredReports(undefined);
      return;
    }
    const filtered = reports?.filter((x: Report) => {
      return x.report_name.toLowerCase().includes(term.toLowerCase()) || x.slug_name.toLowerCase().includes(term.toLowerCase())
    });

    setFilteredReports(filtered);
  }

  const RenderLeftActions: React.FC<{}> = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#39bd28' }}>
        <FontAwesome name="star" size={24} color={"black"} />
        <Text>Favorite</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
        <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Reports</Text>
        <Center>
          <ActivityIndicator size="large" color="#000" />
        </Center>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: 'white', height: '100%', paddingTop: '6%' }}>
      <Text h2 style={{ paddingBottom: '2%', paddingLeft: '2%' }}>Reports</Text>
      <SearchBar
        placeholder="Enter a report name or slug..."
        platform={Platform.OS == "ios" ? "ios" : "android"}
        onChangeText={(term: string) => { updateReportList(term) }}
        onClear={() => updateReportList('')}
        onCancel={() => updateReportList('')}
        clearIcon
        value={searchText ? searchText : ''}

      />
      {!loading && reports?.length === 0 ? <NoResults /> :
        <FlatList
          keyExtractor={(item: any) => item.slug_id}
          data={filteredReports ? filteredReports : reports}
          renderItem={({ item, index }) => (
            <Swipeable
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
          )
          }
        />
      }
    </View>
  );
}