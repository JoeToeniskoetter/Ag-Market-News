import React from 'react';
import {StyleSheet, View} from 'react-native';

interface DividerProps {}

export const Divider: React.FC<DividerProps> = ({}) => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: '#D8D5D5',
    width: '90%',
    alignSelf: 'center',
  },
});
