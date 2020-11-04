import Share from 'react-native-share';
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
