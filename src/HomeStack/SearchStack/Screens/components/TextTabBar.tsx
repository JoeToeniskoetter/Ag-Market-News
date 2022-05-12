import * as React from 'react';
import {Animated, View, Text, StyleSheet, I18nManager} from 'react-native';
import Ionicons from 'react-native-vector-icons';
import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import {CommoditySearchScreen} from '../CommoditySearch';
import {useNavigation} from '@react-navigation/native';
import {MarketTypeSearch} from '../MarketTypeSearch';
import {OfficeSearchScreen} from '../OfficeSearch';
import {ReportSearchScreen} from '../ReportNameSearch';
import {RecentReports} from '../RecentReports';

type Route = {
  key: string;
};

type State = NavigationState<Route>;

export default class CustomIndicatorExample extends React.Component<{}, State> {
  static backgroundColor = '#263238';
  static appbarElevation = 4;

  state: State = {
    index: 0,
    routes: [
      {
        key: 'commodities',
      },
      {
        key: 'market type',
      },
      {
        key: 'office',
      },
      {
        key: 'all reports',
      },
      {
        key: 'recent',
      },
    ],
  };

  private handleIndexChange = (index: number) =>
    this.setState({
      index,
    });

  private renderLabel = ({route}: {route: Route}) => (
    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
      {route.key.toUpperCase()}
    </Text>
  );

  private renderTabBar = (
    props: SceneRendererProps & {navigationState: State},
  ) => (
    <TabBar
      {...props}
      scrollEnabled
      renderLabel={this.renderLabel}
      style={styles.tabbar}
      indicatorStyle={{backgroundColor: 'white', marginBottom: 5}}
    />
  );

  private renderScene = SceneMap({
    commodities: () => <CommoditySearchScreen />,
    'market type': () => <MarketTypeSearch />,
    office: () => <OfficeSearchScreen />,
    'all reports': () => <ReportSearchScreen />,
    recent: () => <RecentReports />,
  });

  render() {
    return (
      <TabView
        lazyPreloadDistance={1}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        tabBarPosition="top"
        onIndexChange={this.handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabbar: {
    paddingTop: 60,
    backgroundColor: '#0a84ff',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  indicator: {
    backgroundColor: 'green',
    height: 2,
    borderRadius: 24,
    width: 50,
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
