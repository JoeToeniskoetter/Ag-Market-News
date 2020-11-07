import { createStackNavigator, StackHeaderTitleProps } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native-elements';
import { CommoditySearchScreen } from './Screens/CommoditySearch';
import { MarketTypeSearch } from './Screens/MarketTypeSearch';
import { OfficeSearchScreen } from './Screens/OfficeSearch';
import { PDFView } from "./Screens/PDFView";
import { ReportSearchScreen } from './Screens/ReportNameSearch';
import { ReportScreen } from "./Screens/Reports";
import { SearchScreen } from './Screens/SearchScreen';
import { SearchParamList } from './SearchStackParams';
import { FavOrShareButton } from './Screens/components/FavOrShareButton';


interface SearchStackProps { }

const Stack = createStackNavigator<SearchParamList>();

export const SearchStack: React.FC<SearchStackProps> = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchType"
        component={SearchScreen}
        options={{
          header: () => null,
          title: "Search By"
        }}
      />
      <Stack.Screen
        name="CommoditySearch"
        component={CommoditySearchScreen}
        options={{
          title: "Commodity",
          headerStyle: {
            backgroundColor: '#FFEC9E',
          },
          headerTintColor: "#000",
        }}
      />
      <Stack.Screen
        name="MartketTypeSearch"
        component={MarketTypeSearch}
        options={{
          title: "Market Type",
          headerStyle: {
            backgroundColor: '#92DD91',
          },
          headerTintColor: "#000",
        }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportScreen}
      />
      <Stack.Screen
        name="PDFView"
        component={PDFView}
        options={({ route }) => ({
          headerTitle: (props: StackHeaderTitleProps) => {
            return (
              <Text style={[{ fontWeight: 'bold', fontSize: 18 }]}>
                {route.params.report.slug_name}
              </Text>
            )
          },
          headerRight: () => {
            console.log(route.params.report)
            return <FavOrShareButton report={route.params.report}/>
          }
        })
        }
      />
      <Stack.Screen
        name="OfficeSearch"
        component={OfficeSearchScreen}
        options={{
          title: "Office Search",
          headerStyle: {
            backgroundColor: '#F3B983',
          },
          headerTintColor: "#000"
        }}
      />
      <Stack.Screen
        name="ReportNameSearch"
        component={ReportSearchScreen}
        options={{
          title: "Report Search",
          headerStyle: {
            backgroundColor: '#F1A2A2'
          },
          headerTintColor: '#000'
        }}

      />
    </Stack.Navigator>
  )
};
