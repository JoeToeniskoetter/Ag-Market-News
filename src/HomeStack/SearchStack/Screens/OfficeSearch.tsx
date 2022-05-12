import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Platform, FlatList} from 'react-native';
import {Text, SearchBar, ListItem} from '@rneui/base';
import analytics from '@react-native-firebase/analytics';

import {useSearch} from '../../../Providers/SearchProvider';
import {Office} from '../../../shared/types';
import {
  LoadingSpinner,
  LoadingView,
} from '../../sharedComponents/LoadingSpinner';
import {NoResults} from './components/NoResults';
import {AnalyticEvents} from '../../../shared/util';
import {RetryFetch} from '../../sharedComponents/RetryFetch';

export function OfficeSearchScreen() {
  const {offices, getOffices, loading} = useSearch();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredOffices, setFilteredOffices] = useState<Office[] | null>();
  const navigation = useNavigation();

  useEffect(() => {
    if (!offices) {
      getOffices();
    }
  }, []);

  const updateList = (term: string) => {
    setSearchText(term);
    if (term === '') {
      setFilteredOffices(null);
      return;
    }
    const filtered = offices?.filter((x: Office) => {
      return x.office_name.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredOffices(filtered);
  };

  return (
    <LoadingView loading={loading}>
      <View
        style={{backgroundColor: 'white', height: '100%', paddingTop: '6%'}}>
        <Text h2 style={{paddingBottom: '2%', paddingLeft: '2%'}}>
          Office Search
        </Text>
        <SearchBar
          placeholder="Enter an office name..."
          platform={Platform.OS == 'ios' ? 'ios' : 'android'}
          clearIcon
          onChangeText={(text: string) => updateList(text)}
          value={searchText}
          onClear={() => updateList('')}
          onCancel={() => updateList('')}
        />
        {!loading && (!offices || offices?.length === 0) ? (
          <RetryFetch retryFunction={getOffices} />
        ) : (
          <FlatList
            keyExtractor={(item: any) => item.office_code}
            data={filteredOffices ? filteredOffices : offices}
            renderItem={({item}) => (
              <ListItem
                bottomDivider
                onPress={() => {
                  analytics().logEvent(AnalyticEvents.office_search);
                  navigation.navigate('Reports', {
                    from: 'OFFICE',
                    reportId: item.office_name,
                  });
                }}>
                <ListItem.Content>
                  <ListItem.Title>{item.office_name}</ListItem.Title>
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
