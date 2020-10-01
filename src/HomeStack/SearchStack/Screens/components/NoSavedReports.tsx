import React from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Center } from './Center';
import { Text } from 'react-native';


export const NoSavedReports:React.FC<{}> = () => {
  return (
    <Center>
      <SimpleLineIcons name="drawer" size={50} color="black" />
      <Text style={{fontSize:24}}>No Reports Found</Text>
    </Center>
  )
}