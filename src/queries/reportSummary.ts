import {baseFetch} from './baseFetch';

export async function fetchReportSummary(slg: number) {
  const result = await baseFetch(`/report/summary/${slg}`);
  return result.json();
}
