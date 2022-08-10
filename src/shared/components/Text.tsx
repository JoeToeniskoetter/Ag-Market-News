import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';

export enum TextType {
  HEADING = 'heading',
  SMALL_HEADING = 'smallheading',
  SUB_HEADING = 'subheading',
  PLACEHOLDER = 'placeholder',
}

interface TextProps {
  type: TextType;
  style?: TextStyle;
  value: string;
  onPress?: () => void;
}

export const StyledText: React.FC<TextProps> = ({
  type,
  value,
  style,
  onPress,
}) => {
  return (
    <Text style={[styles[type], {...style}]} onPress={onPress}>
      {value}
    </Text>
  );
};

const styles = StyleSheet.create({
  headingBold: {
    fontFamily: 'DM Sans Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 29,
  },
  heading: {
    fontFamily: 'DM Sans Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 29,
  },
  subheading: {
    fontFamily: 'DM Sans Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#636363',
  },
  smallheading: {
    fontFamily: 'DM Sans Bold',
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholder: {},
});
