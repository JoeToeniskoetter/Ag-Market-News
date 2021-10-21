import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Report} from '../../shared/types';
import {HomeNavProps} from '../HomeStackParams';
import {SearchParamList} from '../SearchStack/SearchStackParams';

export type MyReportsParamList = {
  Reports: undefined;
  PDFView: {report: Report};
};

export type MyReportsNavProps<T extends keyof MyReportsParamList> = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<SearchParamList, 'SearchType'>,
    StackNavigationProp<HomeNavProps<'MyReports'>>
  >;
  // navigation: StackNavigationProp<MyReportsParamList, T>;
  route: RouteProp<MyReportsParamList, T>;
};
