import React from 'react';
import {MyReportsParamList} from './MyReportsStackParams';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {PDFView} from '../SearchStack/Screens/PDFView';
import {ReportsScreen} from './Screens/MyReports';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Platform, AppState} from 'react-native';
import {Colors, sendShare} from '../../shared/util';
import {FavOrShareButton} from '../SearchStack/Screens/components/FavOrShareButton';
import {StyledText, TextType} from '../../shared/components/Text';

interface MyReportsStackProps {}

const Stack = createStackNavigator<MyReportsParamList>();

export const MyReportsStack: React.FC<MyReportsStackProps> = () => {
  const defaultHeaderOptions = (title: string): StackNavigationOptions => ({
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

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={() => ({...defaultHeaderOptions('My Reports')})}
      />
      <Stack.Screen
        name="PDFView"
        component={PDFView}
        options={({route}) => ({
          ...defaultHeaderOptions(route.params.report.slug_name),
          headerRight: () => <FavOrShareButton report={route.params.report} />,
        })}
      />
    </Stack.Navigator>
  );
};
