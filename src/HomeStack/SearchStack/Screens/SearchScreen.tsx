import React from 'react';
import { SearchNavProps } from '../SearchStackParams';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';


export function SearchScreen({ navigation, route }: SearchNavProps<"Reports">) {

  const adUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8015316806136807/9105033552' : 'ca-app-pub-8015316806136807/4483084657';

  return (
    <>
      <View style={styles.container}>
        <Text h2>Search By</Text>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', width: '100%' }}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#FFCC00' }]}
            onPress={() => {
              navigation.navigate("CommoditySearch")
            }}
          >
            <LinearGradient
              colors={['#FFCC00', '#FFEC9E']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/wheat.png")}
                style={styles.icon}
              />
              <View style={{ width: '80%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.searchCategoryText}>Commodity</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("OfficeSearch")
            }}

          >
            <LinearGradient
              colors={['#B75902', '#F3B983']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/company.png")}
                style={styles.icon}
              />
              <View style={{ width: '70%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.searchCategoryText}>Office</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("MartketTypeSearch")}
          >
            <LinearGradient
              colors={['#47B702', '#92DD91']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/market.png")}
                style={styles.icon}
              />
              <View style={{ width: '70%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.searchCategoryText}>Market Type</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#EB5959' }]}
            onPress={async () => {
              navigation.navigate('ReportNameSearch')
            }}

          >
            <LinearGradient
              colors={['#EB5959', '#F1A2A2']}
              style={styles.gradient}
            >
              <Image
                source={require("../../../../assets/003-newspaper.png")}
                style={styles.icon}
              />
              <View style={{ width: '70%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.searchCategoryText}>Report Name</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{backgroundColor:'white'}}>
        <BannerAd
          unitId={__DEV__ ? TestIds.BANNER: adUnitId}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdFailedToLoad={(e: any) =>{
            console.log(e)
          }}
          onAdClosed={() => {}}
          onAdLoaded={()=>{}}
          onAdOpened={()=>{}}
          onAdLeftApplication={()=>{}}
        />
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  card: {
    minHeight: 75,
    height: '20%',
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  gradient: {
    height: '100%',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 70,
    height: 70,
    marginLeft: '8%'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: '10%',
    backgroundColor: 'white',
    padding: 15,
    height: Dimensions.get('screen').height
  },
  searchCategoryText: {
    fontSize: Dimensions.get('window').width / 10,
    fontWeight: 'bold'
  }
})