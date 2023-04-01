import React from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import LottieView from 'lottie-react-native';

interface LoadingSpinnerProps {
  style?: StyleProp<ViewStyle>;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <LottieView
        source={require('../../../assets/lottie/wheat-loading-spinner.json')}
        autoPlay
        loop
        speed={1.5}
        style={{width: 100, height: 100}}
      />
    </View>
  );
};

export const LoadingView: React.FC<{
  loading: boolean;
  width?: number;
  height?: number;
  backgrounColor?: string;
}> = ({children, loading, width, height, backgrounColor}) => {
  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgrounColor || 'white',
          }}>
          <LottieView
            source={require('../../../assets/lottie/wheat-loading-spinner.json')}
            autoPlay
            loop
            speed={1.5}
            style={{width: width ? width : 100, height: height ? height : 100}}
          />
        </View>
      ) : (
        children
      )}
    </>
  );
};
