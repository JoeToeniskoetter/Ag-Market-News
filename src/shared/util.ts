import {Report} from '../Providers/SearchProvider';
const BASE_URI = 'https://joetoeniskoetter.com/api/ag-market-news/report/';

enum ReportTypes {
  PDF = 'pdf',
  TXT = 'txt',
}

type ReportTypeCheck = {
  url: string;
  type: ReportTypes;
};

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
      type: ReportTypes.TXT
    }
  }
}
