import React from 'react';
import {View, Text} from 'react-native';
import {Center} from './Center';

export const NoResults:React.FC<{}> = () => {
  return (
    <Center>
      <Text>
        No Results Found
      </Text>
    </Center>
  )
}