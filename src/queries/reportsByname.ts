import {baseFetch} from './baseFetch';

export async function fetchReportsByName() {
  const result = await baseFetch(`/reports`);
  return result.json();
}
