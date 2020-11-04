import React from 'react';
import { MyReportsParamList } from './MyReportsStackParams';
import { createStackNavigator } from '@react-navigation/stack';
import { PDFView } from './Screens/PDFView';
import { ReportsScreen } from './Screens/MyReports';
import Icon from 'react-native-vector-icons/EvilIcons'
import { Platform } from 'react-native'
import { sendShare } from '../../shared/util';

interface MyReportsStackProps { }

const Stack = createStackNavigator<MyReportsParamList>();

export const MyReportsStack: React.FC<MyReportsStackProps> = () => {
  


  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="PDFView"
        component={PDFView}
        options={({ route }) => ({
          headerTitle: route.params.report.slug_name,
          headerRight: () => {
            //need to send the url from market news instead of proxy server
            const reportType = route.params.report.report_url?.includes('pdf') ? 'pdf' : 'txt';
            const reportUrl = `https://www.ams.usda.gov/mnreports/${route.params.report.slug_name}.${reportType}`;
            const publishedDate = new Date(route.params.report.published_date.toString().split(' ')[0]).toDateString();
            return (
              <Icon
                name={Platform.OS == "ios" ? "share-apple" : "share-google"}
                color={Platform.OS == "ios" ? 'rgb(0, 122, 255)' : 'black'}
                size={38}
                style={{ paddingRight: 20 }}
                onPress={() => sendShare(`Check out this report! - ${route.params.report.report_title}: ${publishedDate}`, reportUrl )}
              />
            )
          }
        })
        }
      />
    </Stack.Navigator>
  )
};

