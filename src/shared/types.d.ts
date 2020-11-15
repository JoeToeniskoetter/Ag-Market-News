export type Office = {
  office_name: string;
  office_code: string;
};

export type Report = {
  slug_id: Number;
  slug_name: string;
  report_title: string;
  published_date: Date;
  markets: String[];
  market_types: String[];
  offices: String[];
  sectionNames: String[];
  report_name: String;
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
