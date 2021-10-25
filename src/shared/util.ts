import {Platform} from 'react-native';
import Share from 'react-native-share';
import {Report} from './types';

enum ReportTypes {
  PDF = 'pdf',
  TXT = 'txt',
}

type ReportTypeCheck = {
  url: string;
  type: ReportTypes;
};

export const BASE_URI: string = __DEV__
  ? 'http://localhost:5001/ag-market-news-74525/us-central1/api'
  : 'https://us-central1-ag-market-news-74525.cloudfunctions.net/api';

export async function getReportType(rpt: Report): Promise<ReportTypeCheck> {
  let tempUri: string = `${BASE_URI}${rpt.slug_name}.pdf`;
  const res = await fetch(tempUri);
  if (res.ok) {
    return {
      url: tempUri,
      type: ReportTypes.PDF,
    };
  } else {
    return {
      url: `${BASE_URI}${rpt.slug_name}.txt`,
      type: ReportTypes.TXT,
    };
  }
}

export async function getReportUrl(rptSlug: string): Promise<ReportTypeCheck> {
  let tempUri: string = `${BASE_URI}${rptSlug}.pdf`;
  const res = await fetch(tempUri);
  if (res.ok) {
    return {
      url: tempUri,
      type: ReportTypes.PDF,
    };
  } else {
    return {
      url: `${BASE_URI}${rptSlug}.txt`,
      type: ReportTypes.TXT,
    };
  }
}

export async function sendShare(msg: string, url: string) {
  Share.open({
    message: msg,
    url,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => console.log(e));
}

export const AnalyticEvents = {
  ...(__DEV__ ? {myReports: 'DEV_myReports'} : {myReports: 'myReports'}),
  ...(__DEV__
    ? {commodity_search: 'DEV_commodity_search'}
    : {commodity_search: 'commodity_search'}),
  ...(__DEV__
    ? {office_search: 'DEV_office_search'}
    : {office_search: 'office_search'}),
  ...(__DEV__
    ? {market_type_search: 'DEV_market_type_search'}
    : {market_type_search: 'market_type_search'}),
  ...(__DEV__
    ? {report_name_search: 'DEV_report_name_search'}
    : {report_name_search: 'report_name_search'}),
  ...(__DEV__
    ? {report_favorited: 'DEV_report_favorited'}
    : {report_favorited: 'report_favorited'}),
  ...(__DEV__
    ? {report_selected: 'DEV_report_selected'}
    : {report_selected: 'report_selected'}),
  ...(__DEV__
    ? {report_subscribed: 'DEV_report_subscribed'}
    : {report_subscribed: 'report_subscribed'}),
  ...(__DEV__
    ? {report_unsubscribed: 'DEV_report_unsubscribed'}
    : {report_unsubscribed: 'report_unsubscribed'}),
};

export const AD_UNIT_ID =
  Platform.OS == 'ios'
    ? 'ca-app-pub-8015316806136807/9105033552'
    : 'ca-app-pub-8015316806136807/4483084657';
