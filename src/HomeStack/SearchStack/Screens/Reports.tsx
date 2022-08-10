import React, {useState} from 'react';
import {Text, SearchBar, ListItem} from '@rneui/base';
import {View, Platform, FlatList, Alert} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SearchNavProps} from '../SearchStackParams';
import {useMyReports} from '../../../Providers/MyReportsProvider';
import {Report} from '../../../shared/types';
import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-toast-message';
import {AnalyticEvents, Colors} from '../../../shared/util';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {RetryFetch} from '../../sharedComponents/RetryFetch';
import {fetchReports} from '../../../queries/reports';
import {SearchInput} from '../components/SearchInput';
import {StyledText, TextType} from '../../../shared/components/Text';

export function ReportScreen({route}: SearchNavProps<'Reports'>) {
  const {data, isLoading, isError, refetch} = useQuery<Report[], Error>(
    `reports/${route.params.from}/${route.params.reportId}`,
    () =>
      fetchReports({from: route.params.from, reportId: route.params.reportId}),
  );
  const {addReport} = useMyReports();
  const [searchText, setSearchText] = useState<string>('');
  const navigation = useNavigation();

  const row: Array<any> = [];

  const RenderLeftActions: React.FC<{}> = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          backgroundColor: '#39bd28',
          marginHorizontal: 10,
          marginBottom: 5,
          borderRadius: 10,
        }}>
        <FontAwesome name="star" size={24} color={'black'} />
        <Text>Favorite</Text>
      </View>
    );
  };

  return (
    <LoadingView loading={isLoading}>
      <View
        style={{
          backgroundColor: Colors.BACKGROUND,
          height: '100%',
        }}>
        <SearchInput
          placeholder="Enter a report name or slug..."
          onChange={setSearchText}
          onClear={() => setSearchText('')}
          value={searchText ? searchText : ''}
        />
        {isError ? (
          <RetryFetch retryFunction={refetch} />
        ) : (
          <FlatList
            keyExtractor={(item: any) => item.slug_id}
            data={
              searchText.trim() !== ''
                ? data?.filter(
                    r =>
                      r.report_title
                        .toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                      r.slug_name
                        .toLowerCase()
                        .includes(searchText.toLowerCase()),
                  )
                : data
            }
            renderItem={({item, index}) => (
              <Swipeable
                ref={ref => (row[index] = ref)}
                renderLeftActions={() => <RenderLeftActions />}
                onSwipeableOpen={async () => {
                  row[index].close();
                  await addReport(item);
                  Toast.show({
                    visibilityTime: 1500,
                    type: 'success',
                    text1: 'Favorited',
                    text2: `Saved ${item.slug_name} to favorites`,
                  });
                  await analytics().logEvent(AnalyticEvents.report_favorited, {
                    slug: item.slug_name,
                    title: item.report_title,
                  });
                }}>
                <ListItem
                  style={{paddingHorizontal: 10, marginBottom: 5}}
                  containerStyle={{borderRadius: 10}}
                  bottomDivider
                  onPress={async () => {
                    navigation.navigate('Summary', {report: item});
                    // navigation.navigate("PDFView", { report: item })
                    await analytics().logEvent(AnalyticEvents.report_selected, {
                      slug: item.slug_name,
                      title: item.report_title,
                    });
                  }}>
                  <ListItem.Content>
                    <ListItem.Title>
                      <StyledText
                        type={TextType.SMALL_HEADING}
                        value={item.report_title}
                      />
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <StyledText
                        type={TextType.SUB_HEADING}
                        value={`Report ID: ${item.slug_name}`}
                      />
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </Swipeable>
            )}
          />
        )}
      </View>
    </LoadingView>
  );
}
