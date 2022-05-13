import {baseFetch} from './baseFetch';

export async function fetchOffices() {
  const result = await baseFetch(`/offices`);
  return result.json();
}
