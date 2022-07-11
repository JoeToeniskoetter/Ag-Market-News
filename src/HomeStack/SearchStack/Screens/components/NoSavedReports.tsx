import React from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Center} from './Center';
import {Text} from 'react-native';

interface INoSavedReports {
  text?: string;
}

export const NoSavedReports: React.FC<INoSavedReports> = ({text}) => {
  return (
    <Center>
      <SimpleLineIcons name="drawer" size={50} color="black" />
      <Text style={{fontSize: 24}}>{text ? text : 'No Reports Found'}</Text>
    </Center>
  );
};
