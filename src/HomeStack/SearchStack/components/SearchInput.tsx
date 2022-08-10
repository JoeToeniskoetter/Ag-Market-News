import {Input} from '@rneui/themed';
import React from 'react';
import {Colors} from '../../../shared/util';

interface SearchInputProps {
  onClear: () => void;
  onChange: (text: string) => void;
  placeholder?: string;
  value: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onChange,
  children,
}) => {
  return (
    <Input
      leftIcon={{
        type: 'font-awesome',
        name: 'search',
        color: Colors.PRIMARY,
        size: 18,
      }}
      clearButtonMode={'always'}
      onChangeText={onChange}
      leftIconContainerStyle={{paddingLeft: 10}}
      inputContainerStyle={{
        borderBottomWidth: 0,
        marginHorizontal: 5,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 4,
          height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 5,
      }}
      placeholder={placeholder || 'Search All Reports'}
      placeholderTextColor={'#7B7B7B'}
      style={{paddingLeft: 15}}>
      {children}
    </Input>
  );
};
