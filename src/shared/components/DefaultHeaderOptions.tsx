import {StackNavigationOptions} from '@react-navigation/stack';
import React from 'react';
import {Colors} from '../util';
import {StyledText, TextType} from './Text';

export const defaultHeaderOptions = (
  title: string,
): StackNavigationOptions => ({
  headerStyle: {backgroundColor: Colors.PRIMARY},
  headerTitle: () => {
    return (
      <StyledText
        type={TextType.HEADING}
        value={title}
        style={{color: 'white'}}
      />
    );
  },
  headerTintColor: 'white',
});
