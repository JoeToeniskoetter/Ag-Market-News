import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native'; 
import { HomeParamList } from "./HomeStackParams";
import {SearchStack} from './SearchStack/SearchStack';
import {MyReportsStack} from './MyReportsStack/MyReportsStack';
import Icon from 'react-native-vector-icons/FontAwesome';

interface HomeStackProps {}

const Tabs = createBottomTabNavigator<HomeParamList>();

export const HomeStack: React.FC<HomeStackProps> = () => {
  return (
    <Tabs.Navigator
    initialRouteName={"Search"}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Search") {
          iconName = "Search";
          return <Icon name="search" size={24} color={color} />;
        }else if (route.name === "MyReports") {
          return <Icon name="file-text" size={24} color={color} />
        }
        // else if (route.name === "Futures"){
        //   return <FontAwesome name="line-chart" size={24} color={color}/>
        // }
      }
    })}

      tabBarOptions={{
        activeTintColor: "blue",
        inactiveTintColor: "gray"
      }}
    >
      <Tabs.Screen 
        name="Search"
        component={SearchStack}
      />
      <Tabs.Screen
        name="MyReports"
        component={MyReportsStack}
      />
      {/* <Tabs.Screen
        name="Futures"
        component={Futures}
      /> */}
      </Tabs.Navigator>
  );
};


const Futures: React.FC<{}> = () => {
  return <View><Text>Futures</Text></View>
}

