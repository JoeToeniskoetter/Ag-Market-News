import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PreviousReportsData, Report, ReportSummary} from '../../shared/types';
import {HomeNavProps} from '../HomeStackParams';

export enum SearchCategory {
  COMMODITY = 'commodities',
  MARKET_TYPE = 'markets',
  LOCATION = 'offices',
  REPORTS = 'reports',
}

export type SearchParamList = {
  SearchType: undefined;
  CommoditySearch: undefined;
  MartketTypeSearch: undefined;
  OfficeSearch: undefined;
  ReportNameSearch: undefined;
  ListScreen: {category: SearchCategory};
  Summary: {report: Report};
  PreviousReports: {report: Report; summary: ReportSummary};
  RecentReports: undefined;
  Reports: {reportId: string; from: SearchCategory};
  PDFView: {report: Report; uri?: string};
  MyReports: undefined;
};

export type SearchStackNavProps = CompositeNavigationProp<
  StackNavigationProp<SearchParamList, 'SearchType'>,
  BottomTabNavigationProp<HomeNavProps<'MyReports'>>
>;

export type SearchNavProps<T extends keyof SearchParamList> = {
  navigation: StackNavigationProp<SearchParamList, T>;
  route: RouteProp<SearchParamList, T>;
};
