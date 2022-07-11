import {ListItem} from '@rneui/base';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {AnalyticEvents} from '../../../shared/util';
import analytics from '@react-native-firebase/analytics';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useMyReports} from '../../../Providers/MyReportsProvider';
import {NoSavedReports} from '../../SearchStack/Screens/components/NoSavedReports';

interface INewReports {
  searchText: string;
}

export const NewReports: React.FC<INewReports> = ({searchText}) => {
  const navigation = useNavigation();
  const {newReports, reportViewed, removeReportFromNew} = useMyReports();
  const row: Array<any> = [];

  return (
    <>
      {newReports?.length === 0 ? (
        <NoSavedReports text={'No New Reports'} />
      ) : (
        <FlatList
          data={
            searchText.trim() !== ''
              ? newReports?.filter(r =>
                  r.report_title
                    .toLowerCase()
                    .includes(searchText.toLowerCase()),
                ) ||
                newReports?.filter(r =>
                  r.slug_name.toLowerCase().includes(searchText.toLowerCase()),
                )
              : newReports
          }
          keyExtractor={item => item.slug_name}
          renderItem={({item, index}) => (
            <ListItem
              bottomDivider
              onPress={async () => {
                await analytics().logSelectContent({
                  content_type: AnalyticEvents.new_report_click,
                  item_id: item.slug_name,
                });
                navigation.navigate('PDFView', {report: item});
                removeReportFromNew(item);
                reportViewed(item);
              }}>
              {item.report_url?.includes('pdf') ? (
                <AntDesign name="pdffile1" size={24} color={'black'} />
              ) : (
                <AntDesign name="filetext1" size={24} color={'black'} />
              )}
              <ListItem.Content>
                <ListItem.Title>{item.report_title}</ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    fontWeight: 'bold',
                  }}>{`Report ID: ${item.slug_name}`}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  leftButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#39bd28',
    height: '100%',
    padding: 20,
  },
  unSubscribeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d2d6d3',
    height: '100%',
    padding: 20,
  },
  subscribedText: {
    fontSize: 12,
    color: 'green',
    paddingRight: 2,
  },
  card: {
    height: '20%',
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  gradient: {
    height: '100%',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: 70,
    height: 70,
    marginLeft: '8%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '15%',
    backgroundColor: 'white',
  },
  rightButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dd2c00',
    height: '100%',
    padding: 20,
  },
  actionText: {
    fontWeight: '600',
    color: '#fff',
  },
  actionTextDark: {
    fontWeight: '600',
    color: 'black',
  },
});
