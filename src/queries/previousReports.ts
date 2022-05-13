import {baseFetch} from './baseFetch';

export async function fetchPreviousReleases(
  slug_id: number,
  month: number,
  year: string,
) {
  const result = await baseFetch(
    `/report/get_previous_release/${slug_id}?type=month&month=${month}&year=${year}`,
  );
  return result.json();
}
