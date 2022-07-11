import {ListItem} from '@rneui/base';
import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {AnalyticEvents} from '../../../shared/util';
import analytics from '@react-native-firebase/analytics';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Report} from '../../../shared/types';
import {useNavigation} from '@react-navigation/native';
import {useMyReports} from '../../../Providers/MyReportsProvider';
import {NoSavedReports} from '../../SearchStack/Screens/components/NoSavedReports';

interface IFavoriteReports {
  searchText: string;
}

export const FavoriteReports: React.FC<IFavoriteReports> = ({searchText}) => {
  const navigation = useNavigation();
  const {
    reports,
    removeReport,
    unsubscribeToReport,
    subscribeToReport,
    reportViewed,
  } = useMyReports();
  const row: Array<any> = [];

  async function subscribeOrUnSubscribe(report: Report) {
    if (report.subscribed) {
      await analytics().logEvent(AnalyticEvents.report_unsubscribed, {
        slug: report.slug_name,
        title: report.report_title,
      });
      await unsubscribeToReport(report);
    } else {
      await analytics().logEvent(AnalyticEvents.report_subscribed, {
        slug: report.slug_name,
        title: report.report_title,
      });
      await subscribeToReport(report);
      Alert.alert(`Subscribed to ${report.slug_name}`);
    }
  }

  const LeftActionButton: React.FC<{item: Report}> = ({item}) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await removeReport(item);
        }}>
        <View style={styles.rightButton}>
          <FontAwesome name="trash" size={24} color="white" />
          <Text style={styles.actionText}>Remove</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const RightActionButton: React.FC<{item: Report}> = ({item}) => {
    if (item.subscribed) {
      return (
        <TouchableOpacity>
          <View style={styles.unSubscribeButton}>
            <AntDesign name="closecircleo" size={22} color="white" />
            <Text style={styles.actionText}>Unsubscribe</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity>
        <View style={styles.leftButton}>
          <AntDesign name="checkcircleo" size={22} color="black" />
          <Text style={styles.actionTextDark}>Subscribe</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const SubscribedText: React.FC<{}> = () => {
    return (
      <Text style={styles.subscribedText}>
        Subscribed{' '}
        <AntDesign
          name="checkcircleo"
          color="green"
          style={{paddingRight: 3}}
        />
      </Text>
    );
  };

  return (
    <>
      {reports?.length === 0 ? (
        <NoSavedReports />
      ) : (
        <FlatList
          data={
            searchText.trim() !== ''
              ? reports?.filter(r =>
                  r.report_title
                    .toLowerCase()
                    .includes(searchText.toLowerCase()),
                ) ||
                reports?.filter(r =>
                  r.slug_name.toLowerCase().includes(searchText.toLowerCase()),
                )
              : reports
          }
          keyExtractor={item => item.slug_name}
          renderItem={({item, index}) => (
            <Swipeable
              onSwipeableLeftOpen={async () => {
                row[index].close();
                subscribeOrUnSubscribe(item);
              }}
              ref={ref => (row[index] = ref)}
              renderRightActions={() => <LeftActionButton item={item} />}
              renderLeftActions={() => <RightActionButton item={item} />}>
              <ListItem
                bottomDivider
                onPress={async () => {
                  await analytics().logSelectContent({
                    content_type: AnalyticEvents.myReports,
                    item_id: item.slug_name,
                  });
                  navigation.navigate('PDFView', {report: item});
                  reportViewed(item);
                }}>
                {item.report_url?.includes('pdf') ? (
                  <AntDesign name="pdffile1" size={24} color={'black'} />
                ) : (
                  <AntDesign name="filetext1" size={24} color={'black'} />
                )}
                <ListItem.Content>
                  {item.subscribed ? <SubscribedText /> : null}
                  <ListItem.Title>{item.report_title}</ListItem.Title>
                  <ListItem.Subtitle
                    style={{
                      fontWeight: 'bold',
                    }}>{`Report ID: ${item.slug_name}`}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </Swipeable>
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
