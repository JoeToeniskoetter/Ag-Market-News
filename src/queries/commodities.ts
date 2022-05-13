import {baseFetch} from './baseFetch';

export async function fetchCommodities() {
  return await (await baseFetch(`/commodities`)).json();
}

export function fetchReportsForCommodities(commodityId: string) {
  return baseFetch(`/commodities?id=`);
}
