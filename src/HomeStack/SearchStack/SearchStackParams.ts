import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Report, ReportSummary} from '../../shared/types';
import {HomeNavProps} from '../HomeStackParams';

export type SearchParamList = {
  SearchType: undefined;
  CommoditySearch: undefined;
  MartketTypeSearch: undefined;
  OfficeSearch: undefined;
  ReportNameSearch: undefined;
  Summary: {report: Report};
  PreviousReports: {report: Report, summary:ReportSummary};
  Reports: {reportId: string; from: String};
  PDFView: {report: Report};
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
