import {baseFetch} from './baseFetch';

export async function fetchMarketTypes() {
  const result = await baseFetch(`/markets`);
  return result.json();
}
