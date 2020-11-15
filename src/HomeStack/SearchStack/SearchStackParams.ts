import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Report} from '../../shared/types';

export type SearchParamList = {
  SearchType: undefined;
  CommoditySearch: undefined;
  MartketTypeSearch: undefined;
  OfficeSearch: undefined;
  ReportNameSearch: undefined;
  Reports: {reportId: string; from: String};
  PDFView: {report: Report};
  MyReports: undefined;
};

export type SearchNavProps<T extends keyof SearchParamList> = {
  navigation: StackNavigationProp<SearchParamList, T>;
  route: RouteProp<SearchParamList, T>;
};
