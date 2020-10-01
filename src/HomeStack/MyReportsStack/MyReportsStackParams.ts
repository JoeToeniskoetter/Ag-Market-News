import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {Report} from '../../Providers/SearchProvider'

export type MyReportsParamList = {
  Reports: undefined;
  PDFView: {report:Report};
};

export type MyReportsNavProps<T extends keyof MyReportsParamList> = {
  navigation: StackNavigationProp<MyReportsParamList, T>;
  route: RouteProp<MyReportsParamList, T>;
};