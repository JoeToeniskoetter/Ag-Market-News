import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type Office = {
  office_name: string;
  office_code: string;
};

export type Report = {
  slug_id: number;
  slug_name: string;
  report_title: string;
  published_date: string;
  timestamp: FirebaseFirestoreTypes.Timestamp;
  markets: string[];
  market_types: string[];
  offices: string[];
  sectionNames: string[];
  report_name: string;
  report_url: string | undefined;
  subscribed: boolean;
};

export type Commodity = {
  commodity_name: String;
  commodity_lov_id: Number;
};

export type ReportForSeach = {
  slug_name: string;
  report_title: string;
  published_date: Date;
};

export type MarketType = {
  market_type: string;
  market_type_id: string;
};

export type SavedReport = {
  slug_name: string;
  report_title: string;
};

export type ReportSummary = {
  description: string;
  previousReleases: [
    {
      year: string;
      months: string[];
    },
  ];
  synopsis: string;
  title: string;
};

export interface PreviousReportsData {
  data: PreviousReports[];
}

export interface PreviousReports {
  title: string;
  document_date: string;
  file_extension: string;
  document_url: string;
  report_date: Date;
  slug_id: string;
  report_end_date: string;
}
