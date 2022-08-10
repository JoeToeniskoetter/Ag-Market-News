import {RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import {defaultHeaderOptions} from '../shared/components/DefaultHeaderOptions';
import {Settings} from './Settings';

export type SettingsParamList = {
  Settings: undefined;
  Notifications: undefined;
  HelpAndSupport: undefined;
};

export type SettingsNavProps<T extends keyof SettingsParamList> = {
  navigation: StackNavigationProp<SettingsParamList, T>;
  route: RouteProp<SettingsParamList, T>;
};

const Stack = createStackNavigator<SettingsParamList>();

interface SettingsStackProps {}

export const SettingsStack: React.FC<SettingsStackProps> = ({}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{...defaultHeaderOptions('Settings')}}
      />
    </Stack.Navigator>
  );
};
