import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeParamList } from "./HomeStackParams";
import { SearchStack } from './SearchStack/SearchStack';
import { MyReportsStack } from './MyReportsStack/MyReportsStack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SubscriptionContext } from '../Providers/SubscriptionProvider';
import { Badge } from 'react-native-elements';

interface HomeStackProps { }

const Tabs = createBottomTabNavigator<HomeParamList>();

export const HomeStack: React.FC<HomeStackProps> = () => {
  return (
    <Tabs.Navigator
      initialRouteName={"Search"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Search") {
            return <Icon name="search" size={size} color={color} />;
          } else if (route.name === "MyReports") {
            return <MyReportsTab color={color} size={size} />
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
        options={{
          title: "My Reports"
        }}
      />
    </Tabs.Navigator>
  );
};


const MyReportsTab: React.FC<{ size: number, color: string }> = ({ color, size }) => {
  const {newReports } = useContext(SubscriptionContext)
  return (
    <>
      {newReports.length > 0 ? <Badge value={newReports.length} badgeStyle={{backgroundColor:'red'}} /> : null}
      <Icon name="file-text" size={size} color={color}/>
    </>
  )
}
