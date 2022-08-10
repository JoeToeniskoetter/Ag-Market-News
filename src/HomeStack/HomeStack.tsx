import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeParamList} from './HomeStackParams';
import {SearchStack} from './SearchStack/SearchStack';
import {MyReportsStack} from './MyReportsStack/MyReportsStack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Settings} from '../Settings/Settings';
import {useFirebaseAuth} from '../Providers/FirebaseAuthProvider';
import {LoadingView} from './sharedComponents/LoadingSpinner';
import {Colors} from '../shared/util';
import {defaultHeaderOptions} from '../shared/components/DefaultHeaderOptions';
import {SettingsStack} from '../Settings/SettingsStack';

interface HomeStackProps {}

const Tabs = createBottomTabNavigator<HomeParamList>();

export const HomeStack: React.FC<HomeStackProps> = () => {
  const {initializing} = useFirebaseAuth();

  return (
    <LoadingView loading={initializing}>
      <Tabs.Navigator
        initialRouteName={'Search'}
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            if (route.name === 'Search') {
              return <Icon name="search" size={size} color={color} />;
            } else if (route.name === 'MyReports') {
              return <MyReportsTab color={color} size={size} />;
            } else if (route.name === 'Settings') {
              return <Icon name="gears" size={size} color={color} />;
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: 'black',
          inactiveTintColor: 'white',
          style: {backgroundColor: Colors.PRIMARY},
        }}>
        <Tabs.Screen name="Search" component={SearchStack} />
        <Tabs.Screen
          name="MyReports"
          component={MyReportsStack}
          options={{title: 'My Reports'}}
        />
        <Tabs.Screen
          name="Settings"
          component={SettingsStack}
          options={{...defaultHeaderOptions('Settings')}}
        />
      </Tabs.Navigator>
    </LoadingView>
  );
};

const MyReportsTab: React.FC<{size: number; color: string}> = ({
  color,
  size,
}) => {
  return <Icon name="file-text" size={size} color={color} />;
};
