import React from 'react';
import { MyReportsParamList } from './MyReportsStackParams';
import { createStackNavigator } from '@react-navigation/stack';
import { PDFView } from './Screens/PDFView';
import { ReportsScreen } from './Screens/MyReports';
import { Alert } from 'react-native';
import Share from 'react-native-share';

import Icon from 'react-native-vector-icons/EvilIcons'
import { Platform } from 'react-native'

interface MyReportsStackProps { }

const Stack = createStackNavigator<MyReportsParamList>();

export const MyReportsStack: React.FC<MyReportsStackProps> = () => {

  async function sendShare(msg: string, url:string){
    Share.open({
        message: msg, 
        url, 
        })
        .then(res => {
          console.log(res)
        })
        .catch(e => console.log(e))
  }
  


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
            const reportUrl = `https://mymarketnews.ams.usda.gov/viewReport/${route.params.report.slug_id}${route.params.report}`
            return (
              <Icon
                name={Platform.OS == "ios" ? "share-apple" : "share-google"}
                color={Platform.OS == "ios" ? 'rgb(0, 122, 255)' : 'black'}
                size={38}
                style={{ paddingRight: 20 }}
                onPress={() => sendShare('Check out this report!', reportUrl )}
              />
            )
          }
        })
        }
      />
    </Stack.Navigator>
  )
};

