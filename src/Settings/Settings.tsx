import React, { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, TouchableHighlight, Linking, Share, Alert, Platform, Modal, Pressable, Animated, EmitterSubscription, ScrollViewBase } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Antdesign from 'react-native-vector-icons/AntDesign';
import * as RNIap from 'react-native-iap';
import BottomSheet from 'reanimated-bottom-sheet';
import { Product } from 'react-native-iap';
import { ActivityIndicator } from 'react-native';
import { Dimensions, ScrollView } from 'react-native';

const GOOGLE_PLAY_URL: string = 'https://play.google.com/store/apps/details?id=com.ag_market_news.android';
const APP_STORE_URL: string = 'https://apps.apple.com/us/app/ag-market-news/id1538518553';


const productIds = Platform.select({
  ios: [
    'amn.tip.99',
    'amn.tip.199',
    'amn.tip.499',
    'amn.tip.999',
    'amn.tip.1999'
  ],
  android: [
    'amn.tip.99',
    'amn.tip.199',
    'amn.tip.499',
    'amn.tip.999',
    'amn.tip.1999'
  ]
});

interface SettingsProps {

}

interface SupportSelectionProps {
  onPress: Function,
  title: string,
  color: string,
  iconName: string,
  iconType: string
}

const SupportSelection: React.FC<SupportSelectionProps> = ({ onPress, color, iconName, iconType, title }) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={{ alignItems: 'center', width: '100%' }}>
      <>
        {iconType === "antdesign" ? <Antdesign name={iconName} size={40} color={color} /> : <Fontawesome name={iconName} size={40} color={color} />}
        <Text style={{ fontSize: 18, padding: 5, fontWeight: 'bold' }}>{title}</Text>
      </>
    </TouchableOpacity>
  )
}

const rateThisAppLink = async () => {

  //android 
  if (Platform.OS === 'android') {
    return await Linking.openURL(`market://details?id=${GOOGLE_PLAY_URL}`)
  } else {
    //ios 
    return await Linking.openURL(APP_STORE_URL);
    // return await Linking.openURL(`itms-apps://itunes.apple.com/us/appapple-store/${APP_STORE_APP_ID}?mt=8`)
  }
}

const openEmail = async () => {
  return await Linking.openURL('mailto:ag.market.news.app@gmail.com?subject=Ag Market News Feature Request&body=Feature Request Title:\n\nFeature Details:\n\n')
}

const shareAppLink = async () => {

  try {
    const result = await Share.share({
      title: 'App link',
      message: `Check out this app! ${Platform.OS === 'ios' ? APP_STORE_URL : GOOGLE_PLAY_URL}`
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
}


export const Settings: React.FC<SettingsProps> = ({ }) => {

  const [products, setProducts] = useState<RNIap.Product[] | null>(null);
  const [iapLoading, setIapLoading] = useState<boolean>(false);
  const [iapError, setIapError] = useState<string>();
  const [purchaseListener, setPurchaseListener] = useState<EmitterSubscription>();
  const [purchaseErrorListener, setPurchaseErrorListener] = useState<EmitterSubscription>();
  const sheetRef = React.useRef<BottomSheet>(null);
  const bgBlur = React.useRef(new Animated.Value(1)).current;
  const { height, width } = Dimensions.get('screen');

  const setupConnection = async () => {
    await RNIap.initConnection()
    await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
    if (!purchaseListener) {
      let purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase: RNIap.InAppPurchase | RNIap.SubscriptionPurchase | RNIap.ProductPurchase) => {
        const receipt = purchase.transactionReceipt;
        console.log('GOT RECEIPT: ', receipt)
        if (receipt) {

          if (Platform.OS === 'ios') {
            purchase.transactionId && await RNIap.finishTransactionIOS(purchase.transactionId);
          } else if (Platform.OS === 'android') {
            if (purchase.purchaseToken) {
              RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken).then((y) => {
                console.log(y)
                RNIap.finishTransaction(purchase, true).catch(err => {
                }).then((x) => {
                });
              }).catch(e => {
                console.log(e.message);
              });
            }
          }
        } else {
          // Retry / conclude the purchase is fraudulent, etc...
        }
        sheetRef.current?.snapTo(1)
      });
      setPurchaseListener(purchaseUpdateSubscription);
    }
  }

  const setupErrorListener = () => {
    if (!purchaseErrorListener) {
      let errorListener = RNIap.purchaseErrorListener((error: RNIap.PurchaseError) => {
        console.log('purchaseErrorListener', error);
      });
      setPurchaseErrorListener(errorListener);
    }
  }


  const getIAPProducts = async () => {
    try {
      await setupConnection();
      if (productIds) {
        const products: RNIap.Product[] = await RNIap.getProducts(productIds);
        products.sort((a, b) => {
          return Number(a.price) - Number(b.price)
        })
        setProducts(products)
        // console.log(products)
      }

    } catch (err) {
      setIapError(err.message)
      // console.warn(err); // standardized err.code and err.message available
    }
  }

  const requestPurchase = async (sku: string) => {
    try {
      await RNIap.requestPurchase(sku, false);
    } catch (err) {
      console.log(err.code, err.message);
    }
  }

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(bgBlur, {
      toValue: .2,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const openSheet = async () => {
    setIapLoading(true);
    fadeIn();
    sheetRef.current?.snapTo(0);
    getIAPProducts().then(() => {
      setIapLoading(false);
    })

  }
  const onSheetClose = () => {
    Animated.timing(bgBlur, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }


  const data = [
    {
      key: 1,
      title: 'Rate this app',
      iconName: "staro",
      iconType: "antdesign",
      color: "#ccc900",
      onPress: rateThisAppLink
    },
    {
      key: 2,
      title: 'Share this app',
      iconName: 'share',
      iconType: 'fontawesome',
      color: "black",
      onPress: shareAppLink
    },
    {
      key: 3,
      title: 'Leave a Tip',
      iconName: 'dollar',
      iconType: 'fontawesome',
      color: "green",
      onPress: openSheet
    },
    {
      key: 4,
      title: 'Feature Request',
      iconName: 'message1',
      iconType: 'antdesign',
      color: "black",
      onPress: openEmail,
    }
  ];

  React.useEffect(() => {
    setupConnection();
    setupErrorListener();
    return () => {
      purchaseListener?.remove();
      purchaseErrorListener?.remove();
    }
  }, []);

  const renderContent = () => {

    if (iapLoading) {
      return <View
        style={{
          backgroundColor: 'white',
          // padding: 16,
          height: height * .75,
          shadowColor: '#000',
          shadowOffset: { width: 5, height: 8 },
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ActivityIndicator color="black" size="large" />
      </View>
    }

    if (iapError) {
      return <View
        style={{
          backgroundColor: 'white',
          // padding: 16,
          height: height * .75,
          shadowColor: '#000',
          shadowOffset: { width: 5, height: 8 },
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text>{iapError}</Text>
      </View>
    }


    return (
      <ScrollView
        style={{
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 5, height: 8 }
        }}
        contentContainerStyle={{ height: height }}
      >
        {/* <View style={{ flexDirection: 'row', width: '100%', height: '5%', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 40, height: 3, backgroundColor: 'grey', borderRadius: 10 }}></View>
        </View> */}
        <View style={{ backgroundColor: 'white', marginTop: 20, width: '25%', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            title="Done"
            type={"clear"}
            titleStyle={{ color: 'rgb(76,217,100)' }}
            onPress={() => {
              sheetRef.current?.snapTo(1)
            }} />
        </View>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 15 }}>{`Thank you for your support! I hope you are enjoying the app.\n\n If you have any feedback or feature requests, please be sure to let me know. All development of this app is completed by me in my spare time.\n\nIf you are enjoying the app and would like to support my work, please consider leaving me a tip!\n\nThank you! -Joe`
          }</Text>
          {products?.sort().map((product: Product, index: number) => {
            return (
              <View key={product.productId} style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20 }}>{`Developer Tip $${product.price}`}</Text>
                  <View>
                    <Button title={`$${product.price}`} raised type={"outline"} buttonStyle={styles.tipButton} titleStyle={{ color: 'rgb(76,217,100)', fontSize: 16 }} onPress={() => requestPurchase(product.productId)} />
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView >
    )
  }

  return (
    <>
      <Animated.View style={[styles.container, { opacity: bgBlur }]}>
        <Text h2 style={styles.header}>Settings</Text>

        {data.map((item, index) => {
          return (
            <View key={item.key} style={styles.supportItemContainer}>
              <SupportSelection key={item.key.toString()} title={item.title} iconName={item.iconName} iconType={item.iconType} color={item.color} onPress={item.onPress} />
            </View>
          )
        })
        }

      </Animated.View>
      <BottomSheet
        ref={sheetRef}
        enabledInnerScrolling={true}
        enabledContentGestureInteraction={true}
        borderRadius={30}
        snapPoints={[height * .75, 0]}
        initialSnap={1}
        renderContent={renderContent}
        onCloseEnd={onSheetClose}
      />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    height: '100%',
    marginTop: '10%',
    marginHorizontal: 15,
  },
  supportItemContainer: {
    backgroundColor: 'white',
    width: '45%',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 3,
    marginVertical: 5
  },
  header: {
    padding: 20,
    width: '100%'
  },
  modal: {
    height: '50%',
    width: '100%'
  },
  sheetContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  purchaseButton: {
    backgroundColor: 'rgb(76,217,100)'
  },
  tipButton: {
    borderRadius: 25,
    borderColor: 'rgb(76,217,100)',
    borderWidth: 2,
    width: 80
  }
})