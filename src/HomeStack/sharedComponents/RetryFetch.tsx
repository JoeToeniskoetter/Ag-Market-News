import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Text} from '@rneui/base';

interface IRetryFetch {
  retryFunction: Function;
}

export const RetryFetch: React.FC<IRetryFetch> = ({retryFunction}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Icon name="redo" size={100} onPress={() => retryFunction()} />
      <Text h4>Retry</Text>
    </View>
  );
};
