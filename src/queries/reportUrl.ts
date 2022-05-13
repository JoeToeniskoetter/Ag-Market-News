import {baseFetch} from './baseFetch';

export async function fetchReportUrl(slg: number) {
  const result = await baseFetch(`/reportLink?id=_${slg}`);
  return result.json();
}
