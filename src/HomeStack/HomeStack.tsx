import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';
import { HomeParamList } from "./HomeStackParams";
import { SearchStack } from './SearchStack/SearchStack';
import { MyReportsStack } from './MyReportsStack/MyReportsStack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-elements';
import { MyReportsContext } from '../Providers/MyReportsProvider';

interface HomeStackProps { }

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
          } else if (route.name === "MyReports") {
            return <MyReportsTabIcon color={color}/>
          }
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
    </Tabs.Navigator>
  );
};

interface IMyReportsTabIcon{
  color:string
}

const MyReportsTabIcon:React.FC<IMyReportsTabIcon> = ({color}) => {

  const { storedReports } = useContext(MyReportsContext);

  if(storedReports.length < 1){
    return (
      <Icon name="file-text" size={24} color={color}/>
    )
  }

  return (
    <>
      <Badge
        value={storedReports.length}
        status="error"
      />
    <Icon name="file-text" size={24} color={color}/>
    </>
  )
}

