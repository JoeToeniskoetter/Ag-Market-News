import {Commodity, MarketType, Office, Report} from '../shared/types';
import {baseFetch} from './baseFetch';

export async function fetchCategoryItems(
  category: 'commodities' | 'markets' | 'offices' | 'reports',
) {
  let res = await (await baseFetch(`/${category}`)).json();

  switch (category) {
    case 'commodities':
      res = res as Commodity[];
      return res.map((i: Commodity) => ({
        name: i.commodity_name,
        id: i.commodity_lov_id,
      }));
    case 'markets':
      res = res as MarketType[];
      return res.map((i: MarketType) => ({
        name: i.market_type,
        id: i.market_type_id,
      }));
    case 'offices':
      res = res as Office[];
      return res.map((i: Office) => ({
        name: i.office_name,
        id: i.office_code,
      }));
    default:
      res = res as Report[];
      return res.map((i: Report) => ({
        name: i.report_title,
        id: i.slug_id,
        ...i,
      }));
  }
}

export function fetchReportsForCommodities(commodityId: string) {
  return baseFetch(`/commodities?id=`);
}
