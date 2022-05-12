import React from 'react';
import {MyReportsParamList} from './MyReportsStackParams';
import {createStackNavigator} from '@react-navigation/stack';
import {PDFView} from '../SearchStack/Screens/PDFView';
import {ReportsScreen} from './Screens/MyReports';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Platform, AppState} from 'react-native';
import {sendShare} from '../../shared/util';
import {FavOrShareButton} from '../SearchStack/Screens/components/FavOrShareButton';

interface MyReportsStackProps {}

const Stack = createStackNavigator<MyReportsParamList>();

export const MyReportsStack: React.FC<MyReportsStackProps> = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PDFView"
        component={PDFView}
        options={({route}) => ({
          headerTitle: route.params.report.slug_name,
          headerRight: () => <FavOrShareButton report={route.params.report} />,
        })}
      />
    </Stack.Navigator>
  );
};
