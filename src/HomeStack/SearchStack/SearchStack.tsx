import {
  createStackNavigator,
  StackHeaderTitleProps,
} from '@react-navigation/stack';
import React from 'react';
import {Text} from '@rneui/base';
import {PDFView} from './Screens/PDFView';
import {ReportScreen} from './Screens/Reports';
import {SearchScreen} from './Screens/SearchScreen';
import {SearchParamList} from './SearchStackParams';
import {FavOrShareButton} from './Screens/components/FavOrShareButton';
import {SummaryScreen} from './Screens/SummaryScreen';
import {PreviousReportsScreen} from './Screens/PreviousReportsScreen';
import {RecentReports} from './Screens/RecentReports';
import {defaultHeaderOptions} from '../../shared/components/DefaultHeaderOptions';
import {ListScreen} from './Screens/ListScreen';

interface SearchStackProps {}

const Stack = createStackNavigator<SearchParamList>();

export const SearchStack: React.FC<SearchStackProps> = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchType"
        component={SearchScreen}
        options={{
          title: 'Browse',
          ...defaultHeaderOptions('Browse'),
        }}
      />

      <Stack.Screen
        name="Reports"
        component={ReportScreen}
        options={{
          title: 'Reports',
          ...defaultHeaderOptions('Reports'),
        }}
      />
      <Stack.Screen
        name="PDFView"
        component={PDFView}
        options={({route}) => ({
          ...defaultHeaderOptions(route.params.report.slug_name),
          headerRight: () => {
            return <FavOrShareButton report={route.params.report} />;
          },
        })}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          title: 'Summary',
          ...defaultHeaderOptions('Summary'),
        }}
      />

      <Stack.Screen
        name="PreviousReports"
        component={PreviousReportsScreen}
        options={{
          headerBackAllowFontScaling: true,
          headerTitleAllowFontScaling: true,
          title: 'Previous Reports',
          ...defaultHeaderOptions('Previous Reports'),
        }}
      />

      <Stack.Screen
        name="RecentReports"
        component={RecentReports}
        options={() => {
          return {
            title: 'Recent Reports',
          };
        }}
      />

      <Stack.Screen
        name="ListScreen"
        component={ListScreen}
        options={({route}) => ({
          title: route.params.category.replace(/\b(\w)/g, k => k.toUpperCase()),
          ...defaultHeaderOptions(
            route.params.category.replace(/\b(\w)/g, k => k.toUpperCase()),
          ),
        })}
      />
    </Stack.Navigator>
  );
};
