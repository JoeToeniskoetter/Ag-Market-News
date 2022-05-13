import {
  TestIds,
  BannerAdSize,
  BannerAd,
} from '@invertase/react-native-google-ads';
import React from 'react';
import {AD_UNIT_ID} from '../../../../shared/util';

export const CustomBannerAdd = () => (
  <BannerAd
    unitId={__DEV__ ? TestIds.BANNER : AD_UNIT_ID}
    size={BannerAdSize.FULL_BANNER}
    requestOptions={{
      requestNonPersonalizedAdsOnly: false,
    }}
    onAdFailedToLoad={(e: any) => {
      console.log(e);
      // setShowAd(false);
    }}
    onAdClosed={() => {}}
    onAdLoaded={() => {
      // setShowAd(true);
    }}
    onAdOpened={() => {}}
    onAdLeftApplication={() => {}}
  />
);
