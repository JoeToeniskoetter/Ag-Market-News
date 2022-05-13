import {Report} from '../shared/types';
import {baseFetch} from './baseFetch';

type IGetReports = {
  from: String;
  reportId: string;
};

const buildUri = (igr: IGetReports): string => {
  let uri: string;

  switch (igr.from) {
    case 'COMMODITY':
      uri = `/commodities?id=${igr.reportId}`;
      break;
    case 'OFFICE':
      uri = `/offices?id=${igr.reportId}`;
      break;
    case 'MARKET_TYPE':
      uri = `/markets?id=${igr.reportId}`;
      break;
    default:
      uri = `/reports`;
      break;
  }

  return uri;
};

function addReportUrlAndSubscription(rpts: Report[]): Report[] {
  return rpts.map((x: Report) => ({...x, report_url: '', subscribed: false}));
}

export async function fetchReports(igr: IGetReports) {
  const uri: string = buildUri(igr);
  const data = await (await baseFetch(uri)).json();
  return addReportUrlAndSubscription(data.results);
}
