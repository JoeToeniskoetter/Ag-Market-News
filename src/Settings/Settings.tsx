import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Linking,
  Share,
  Alert,
  Platform,
  Animated,
  EmitterSubscription,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Avatar, Button, ListItem, Text} from '@rneui/base';
import * as RNIap from 'react-native-iap';
import BottomSheet from 'reanimated-bottom-sheet';
import {Product} from 'react-native-iap';
import {ActivityIndicator} from 'react-native';
import {Dimensions, ScrollView} from 'react-native';
import {InstructionsScreen} from '../HomeStack/InstructionsScreen';
import firestore from '@react-native-firebase/firestore';
import VersionCheck from 'react-native-version-check';

const GOOGLE_PLAY_URL: string =
  'https://play.google.com/store/apps/details?id=com.ag_market_news.android';
const APP_STORE_URL: string =
  'https://apps.apple.com/us/app/ag-market-news/id1538518553';

const productIds = Platform.select({
  ios: [
    'amn.tip.99',
    'amn.tip.199',
    'amn.tip.499',
    'amn.tip.999',
    'amn.tip.1999',
  ],
  android: [
    'amn.tip.99',
    'amn.tip.199',
    'amn.tip.499',
    'amn.tip.999',
    'amn.tip.1999',
  ],
});

interface SettingsProps {}

interface SupportSelectionProps {
  onPress: Function;
  title: string;
  color: string;
  iconName: string;
  iconType: string;
}

const rateThisAppLink = async () => {
  let result = await VersionCheck.needUpdate();
  return await Linking.openURL(result.storeUrl);
};

const sendFeatureRequest = async (name: string, featureRequest: string) => {
  try {
    await firestore()
      .collection('feature-requests')
      .add({
        name: name || 'DEFAULT',
        feature: featureRequest,
      });
  } catch (e) {
    console.log(e);
  }
};

const shareAppLink = async () => {
  try {
    const result = await Share.share({
      title: 'App link',
      message: `Check out this app! ${
        Platform.OS === 'ios' ? APP_STORE_URL : GOOGLE_PLAY_URL
      }`,
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
  } catch (error: any) {
    Alert.alert(error.message);
  }
};

export const Settings: React.FC<SettingsProps> = ({}) => {
  const [products, setProducts] = useState<RNIap.Product[] | null>(null);
  const [iapLoading, setIapLoading] = useState<boolean>(false);
  const [iapError, setIapError] = useState<string>();
  const [purchaseListener, setPurchaseListener] =
    useState<EmitterSubscription>();
  const [purchaseErrorListener, setPurchaseErrorListener] =
    useState<EmitterSubscription>();
  const [seeInstructions, setSeeInstructions] = useState<boolean>(false);
  const sheetRef = React.useRef<BottomSheet>(null);
  const featureRequestRef = React.useRef<BottomSheet>(null);
  const bgBlur = React.useRef(new Animated.Value(1)).current;
  const {height, width} = Dimensions.get('screen');
  const [featureRequestName, setFeatureRequestName] = useState<string>('');
  const [featureRequest, setFeatureRequest] = useState<string>('');
  const [sendingFeatureRequest, setSendingFeatureRequest] =
    useState<boolean>(false);

  const setupConnection = async () => {
    await RNIap.initConnection();
    await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
    if (!purchaseListener) {
      let purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async (
          purchase:
            | RNIap.InAppPurchase
            | RNIap.SubscriptionPurchase
            | RNIap.ProductPurchase,
        ) => {
          const receipt = purchase.transactionReceipt;
          console.log('GOT RECEIPT: ', receipt);
          if (receipt) {
            if (Platform.OS === 'ios') {
              purchase.transactionId &&
                (await RNIap.finishTransactionIOS(purchase.transactionId));
            } else if (Platform.OS === 'android') {
              if (purchase.purchaseToken) {
                RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken)
                  .then(y => {
                    console.log(y);
                    RNIap.finishTransaction(purchase, true)
                      .catch(err => {})
                      .then(x => {});
                  })
                  .catch(e => {
                    console.log(e.message);
                  });
              }
            }
          } else {
            // Retry / conclude the purchase is fraudulent, etc...
          }
          sheetRef.current?.snapTo(1);
        },
      );
      setPurchaseListener(purchaseUpdateSubscription);
    }
  };

  const setupErrorListener = () => {
    if (!purchaseErrorListener) {
      let errorListener = RNIap.purchaseErrorListener(
        (error: RNIap.PurchaseError) => {
          console.log('purchaseErrorListener', error);
        },
      );
      setPurchaseErrorListener(errorListener);
    }
  };

  const getIAPProducts = async () => {
    try {
      //await setupConnection();
      if (productIds) {
        const products: RNIap.Product[] = await RNIap.getProducts(productIds);
        products.sort((a, b) => {
          return Number(a.price) - Number(b.price);
        });
        setProducts(products);
        // console.log(products)
      }
    } catch (err: any) {
      setIapError(err.message);
      // console.warn(err); // standardized err.code and err.message available
    }
  };

  const requestPurchase = async (sku: string) => {
    try {
      await RNIap.requestPurchase(sku, false);
    } catch (err: any) {
      console.log(err.code, err.message);
    }
  };

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(bgBlur, {
      toValue: 0.2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const openSheet = async () => {
    setIapLoading(true);
    fadeIn();
    sheetRef.current?.snapTo(0);
    getIAPProducts().then(() => {
      setIapLoading(false);
    });
  };

  const openFeatureRequestSheet = async () => {
    fadeIn();
    featureRequestRef.current?.snapTo(0);
  };

  const onSheetClose = () => {
    Animated.timing(bgBlur, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const data = [
    {
      key: 1,
      title: 'Rate this app',
      iconName: 'staro',
      iconType: 'antdesign',
      color: '#ccc900',
      onPress: rateThisAppLink,
    },
    {
      key: 2,
      title: 'Share this app',
      iconName: 'share',
      iconType: 'fontawesome',
      color: 'black',
      onPress: shareAppLink,
    },
    {
      key: 3,
      title: 'Leave a Tip',
      iconName: 'dollar-sign',
      iconType: 'feather',
      color: 'green',
      onPress: openSheet,
    },
    {
      key: 4,
      title: 'Feature Request',
      iconName: 'message1',
      iconType: 'antdesign',
      color: 'black',
      onPress: openFeatureRequestSheet,
    },
    {
      key: 5,
      title: 'How to use this app',
      iconName: 'questioncircleo',
      iconType: 'antdesign',
      color: 'orange',
      onPress: () => {
        setSeeInstructions(true);
      },
    },
  ];

  React.useEffect(() => {
    setupConnection();
    setupErrorListener();
    return () => {
      purchaseListener?.remove();
      purchaseErrorListener?.remove();
    };
  }, []);

  const renderContent = () => {
    if (iapLoading) {
      return (
        <View
          style={{
            backgroundColor: 'white',
            // padding: 16,
            height: height * 0.75,
            shadowColor: '#000',
            shadowOffset: {width: 5, height: 8},
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator color="black" size="large" />
        </View>
      );
    }

    if (iapError) {
      return (
        <View
          style={{
            backgroundColor: 'white',
            // padding: 16,
            height: height * 0.75,
            shadowColor: '#000',
            shadowOffset: {width: 5, height: 8},
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>{iapError}</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={{
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {width: 5, height: 8},
        }}
        contentContainerStyle={{height: height}}>
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 20,
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            title="Done"
            type={'clear'}
            titleStyle={{color: 'rgb(76,217,100)'}}
            onPress={() => {
              sheetRef.current?.snapTo(1);
            }}
          />
        </View>
        <View style={{padding: 16}}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 15,
            }}>{`Thank you for your support! I hope you are enjoying the app.\n\n If you have any feedback or feature requests, please be sure to let me know. All development of this app is completed by me in my spare time.\n\nIf you are enjoying the app and would like to support my work, please consider leaving me a tip!\n\nThank you! -Joe`}</Text>
          {products?.sort().map((product: Product, index: number) => {
            return (
              <View
                key={product.productId}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>{`Developer Tip $${product.price}`}</Text>
                  <View>
                    <Button
                      title={`$${product.price}`}
                      type={'outline'}
                      buttonStyle={styles.tipButton}
                      titleStyle={{color: 'rgb(76,217,100)', fontSize: 16}}
                      onPress={() => requestPurchase(product.productId)}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderFeatureRequestSheet = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: height * 0.75,
          alignItems: 'center',
          justifyContent: 'flex-start',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.51,
          shadowRadius: 13.16,

          elevation: 20,
        }}>
        <TextInput
          placeholder="Name: Optional"
          style={{
            width: '90%',
            height: '8%',
            backgroundColor: '#efefef',
            borderRadius: 10,
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
          onChangeText={setFeatureRequestName}
          value={featureRequestName}
        />
        <TextInput
          placeholder="Feature Request"
          multiline
          style={{
            width: '90%',
            height: '25%',
            backgroundColor: '#efefef',
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
          onChangeText={setFeatureRequest}
          value={featureRequest}
          keyboardType={'default'}
        />
        <View style={{width: '90%'}}>
          <Button
            title="Submit"
            disabled={featureRequest.trim() === ''}
            containerStyle={{borderRadius: 10, marginTop: 10}}
            loading={sendingFeatureRequest}
            onPress={async () => {
              if (sendingFeatureRequest) {
                return;
              }
              setSendingFeatureRequest(true);
              await sendFeatureRequest(featureRequestName, featureRequest);
              featureRequestRef?.current?.snapTo(1);
              setFeatureRequest('');
              setFeatureRequestName('');
              setSendingFeatureRequest(false);
            }}
          />
          <Button
            title="Cancel"
            containerStyle={{borderRadius: 10, marginTop: 10}}
            type="solid"
            buttonStyle={{backgroundColor: '#dd2c00'}}
            onPress={() => {
              Keyboard.dismiss();
              featureRequestRef.current?.snapTo(1);
            }}
          />
        </View>
      </View>
    );
  };

  if (seeInstructions) {
    return (
      <InstructionsScreen
        onInstructionsSeen={() => setSeeInstructions(false)}
      />
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <>
        <Animated.View
          style={[
            styles.container,
            {opacity: bgBlur, backgroundColor: 'white', width: '100%', flex: 1},
          ]}>
          <FlatList
            data={data}
            keyExtractor={item => item.title}
            renderItem={({item}) => {
              return (
                <ListItem onPress={() => item.onPress()} bottomDivider>
                  <Avatar
                    rounded
                    size={50}
                    icon={{
                      type: item.iconType,
                      color: item.color,
                      name: item.iconName,
                      size: 40,
                    }}
                  />
                  <ListItem.Title>{item.title}</ListItem.Title>
                  <ListItem.Content></ListItem.Content>
                </ListItem>
              );
            }}
          />
        </Animated.View>
        <BottomSheet
          ref={sheetRef}
          enabledInnerScrolling={true}
          enabledContentGestureInteraction={true}
          borderRadius={30}
          snapPoints={[height * 0.75, 0]}
          initialSnap={1}
          renderContent={renderContent}
          onCloseEnd={onSheetClose}
        />
        <BottomSheet
          ref={featureRequestRef}
          borderRadius={30}
          snapPoints={[height * 0.5, 0]}
          initialSnap={1}
          renderContent={renderFeatureRequestSheet}
          onCloseEnd={onSheetClose}
        />
      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    height: '100%',
    paddingTop: '10%',
  },
  supportItemContainer: {
    backgroundColor: 'white',
    width: '45%',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 3,
    marginVertical: 5,
  },
  header: {
    padding: 20,
    width: '100%',
  },
  modal: {
    height: '50%',
    width: '100%',
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
    backgroundColor: 'rgb(76,217,100)',
  },
  tipButton: {
    borderRadius: 25,
    borderColor: 'rgb(76,217,100)',
    borderWidth: 2,
    width: 80,
  },
});
