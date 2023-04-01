import {useNavigation} from '@react-navigation/native';
import {ListItem} from '@rneui/base';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useQuery} from 'react-query';
import analytics from '@react-native-firebase/analytics';
import {AnalyticEvents} from '../../../shared/util';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {RetryFetch} from '../../sharedComponents/RetryFetch';
import {CustomBannerAdd} from './components/CustomBannerAd';
import {SearchNavProps} from '../SearchStackParams';
import {fetchCategoryItems} from '../../../queries/categoryItems';
import {SearchInput} from '../components/SearchInput';
import {Colors} from '../../../shared/util';
import {StyledText, TextType} from '../../../shared/components/Text';

type Category = {
  [x: string]: string | number | Date;
  name: string;
  id: string;
};

export function ListScreen({route}: SearchNavProps<'ListScreen'>) {
  const {data, isLoading, error, refetch} = useQuery<Category[]>(
    route.params.category,
    () => fetchCategoryItems(route.params.category),
  );
  const [searchText, setSearchText] = useState<string>('');
  const navigation = useNavigation();

  return (
    <LoadingView loading={isLoading}>
      <View
        style={{
          backgroundColor: Colors.BACKGROUND,
          height: '100%',
        }}>
        <SearchInput
          onChange={(t: string) => setSearchText(t)}
          value={searchText}
          onClear={() => setSearchText('')}
          placeholder={'Search...'}
        />
        {error ? (
          <RetryFetch retryFunction={refetch} />
        ) : (
          <FlatList
            keyExtractor={(item: any) => item.id}
            data={
              searchText.trim() !== ''
                ? data?.filter(r =>
                    r.name.toLowerCase().includes(searchText.toLowerCase()),
                  )
                : data
            }
            renderItem={({item}) => (
              <ListItem
                style={
                  route.params.category == 'reports'
                    ? styles.roundedListItemRow
                    : null
                }
                containerStyle={
                  route.params.category == 'reports'
                    ? styles.roundedListItem
                    : null
                }
                bottomDivider
                onPress={() => {
                  if (route.params.category === 'reports') {
                    return navigation.navigate('PDFView', {
                      report: item,
                    });
                  }

                  analytics().logEvent(AnalyticEvents.commodity_search);
                  navigation.navigate('Reports', {
                    from: route.params.category,
                    reportId: item.id,
                  });
                }}>
                <ListItem.Content>
                  <ListItem.Title>
                    <StyledText
                      type={TextType.SMALL_HEADING}
                      value={item.name}
                    />
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    {route.params.category === 'reports' ? (
                      <StyledText
                        type={TextType.SUB_HEADING}
                        value={`Last Updated: ${new Date(
                          item.published_date,
                        ).toDateString()} - ${new Date(
                          item.published_date,
                        ).toLocaleTimeString()}`}
                      />
                    ) : null}
                  </ListItem.Subtitle>
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
}

const styles = StyleSheet.create({
  roundedListItemRow: {
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  roundedListItem: {
    borderRadius: 10,
  },
});
