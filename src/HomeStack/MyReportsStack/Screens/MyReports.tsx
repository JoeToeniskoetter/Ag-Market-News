import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import {ListItem, Text, SearchBar, Badge, withBadge} from '@rneui/base';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useMyReports} from '../../../Providers/MyReportsProvider';
import {Report} from '../../../shared/types';
import {MyReportsNavProps} from '../MyReportsStackParams';
import {NoSavedReports} from '../../SearchStack/Screens/components/NoSavedReports';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';
import InAppReview from 'react-native-in-app-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import {SegmentedControl, Segment} from 'react-native-resegmented-control';
import {AD_UNIT_ID, AnalyticEvents} from '../../../shared/util';
import {StorageReference} from '../../../shared/StorageReference';
import {FavoriteReports} from '../components/FavoriteReports';

export function ReportsScreen({
  navigation,
  route,
}: MyReportsNavProps<'Reports'>) {
  const {reports} = useMyReports();
  const [searchText, setSearchText] = useState<string>('');
  const [showAdd, setShowAdd] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>('Favorites');
  const row: Array<any> = [];

  const reviewExpired = (review: {reviewed: number; initDate: Date}) => {
    const cachedItemTime = new Date(review.initDate);
    return (
      Math.abs((cachedItemTime.getTime() - new Date().getTime()) / 1000) >
      1209600
    );
  };

  const checkLastReviewRequest = async () => {
    // if (__DEV__) await AsyncStorage.removeItem(StorageReference.LAST_REVIEW);
    const newReviewEntry = {
      reviewed: 1,
      initDate: new Date(),
    };
    const review = await AsyncStorage.getItem(StorageReference.LAST_REVIEW);
    if (
      (!review || (review && reviewExpired(JSON.parse(review)))) &&
      reports.length > 0
    ) {
      if (InAppReview.isAvailable()) {
        InAppReview.RequestInAppReview();
        await AsyncStorage.setItem(
          StorageReference.LAST_REVIEW,
          JSON.stringify(newReviewEntry),
        );
      }
    }
  };

  useEffect(() => {
    checkLastReviewRequest();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text style={{paddingLeft: '5%'}} h2>
          My Reports
        </Text>
        <SearchBar
          placeholder="Search for report..."
          platform={Platform.OS == 'ios' ? 'ios' : 'android'}
          clearIcon
          onChangeText={(text: string) => {
            setSearchText(text);
          }}
          value={searchText}
          onClear={() => {
            setSearchText('');
          }}
          onCancel={() => {
            setSearchText('');
          }}
          style={{marginBottom: 0}}
        />
        <CustomSegmentedControl setSelectedTab={setSelectedTab} />
        {selectedTab === 'Favorites' ? (
          <FavoriteReports searchText={searchText} />
        ) : (
          <Text>NEW</Text>
        )}
      </View>
      {showAdd ? (
        <View style={{backgroundColor: 'white'}}>
          <BannerAd
            unitId={__DEV__ ? TestIds.BANNER : AD_UNIT_ID}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(e: any) => {
              setShowAdd(false);
            }}
            onAdClosed={() => {}}
            onAdLoaded={() => {
              setShowAdd(true);
            }}
            onAdOpened={() => {}}
            onAdLeftApplication={() => {}}
          />
        </View>
      ) : null}
    </>
  );
}

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

interface ICustomSegmentedControl {
  setSelectedTab: (name: string) => void;
}

const CustomSegmentedControl: React.FC<ICustomSegmentedControl> = ({
  setSelectedTab,
}) => {
  return (
    <SegmentedControl
      activeTintColor="black"
      inactiveTintColor="white"
      initialSelectedName="Favorites"
      onChangeValue={(name: string) => setSelectedTab(name)}
      style={{marginHorizontal: 10}}>
      <Segment name="Favorites" content={<Text>Favorites</Text>} />
      <Segment
        name="New"
        content={
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{paddingRight: 10}}>New</Text>
            <Badge value={3} status="error" />
          </View>
        }
      />
    </SegmentedControl>
  );
};
