import React, { createContext, useState, Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { Office, Commodity, MarketType, Report, ReportSummary } from '../shared/types';
import { FirebaseAuthProviderContext } from './FirebaseAuthProvider';
import { Cache } from '../shared/Cache';
import { BASE_URI } from '../shared/util';

type IGetReports = {
  from: String,
  reportId: string
}

interface ISearchProvder {
  getCommodities: () => void;
  getReports: (igr: IGetReports) => void;
  getOffices: () => void;
  getMarketTypes: () => void;
  getReportsForSearch: () => void;
  fetchSummary: (slg: number) => void;
  reportSummary: ReportSummary | null;
  setCurrentReportUrl: Dispatch<SetStateAction<string | undefined>>;
  currentReportUrl: string | undefined;
  reportsForSearch: Report[] | null;
  commodities: Commodity[] | null;
  loading: Boolean;
  reports: Report[] | null;
  offices: Office[] | null;
  marketTypes: MarketType[] | null;
}

export const SearchContext = createContext<ISearchProvder>({
  getCommodities: async () => { },
  getOffices: async () => { },
  getReports: async (igr: IGetReports) => { },
  getMarketTypes: async () => { },
  getReportsForSearch: async () => { },
  setCurrentReportUrl: () => { },
  fetchSummary: (slg: number) => { },
  reportSummary: null,
  currentReportUrl: undefined,
  reportsForSearch: null,
  commodities: null,
  loading: false,
  reports: null,
  offices: null,
  marketTypes: null
});



export const SearchProvider: React.FC<{}> = ({ children }) => {
  const [commodities, setCommodities] = useState<Commodity[] | null>(null);
  const [marketTypes, setMarketTypes] = useState<MarketType[] | null>(null);
  const [offices, setOffices] = useState<Office[] | null>(null)
  const [reports, setReports] = useState<Report[] | null>(null);
  const [reportsForSearch, setReportsForSeach] = useState<Report[] | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const [currentReportUrl, setCurrentReportUrl] = useState<string>();
  const [cache, setCache] = useState<Cache>();
  const [reportSummary, setSummary] = useState(null);

  const { state: { user } } = useContext(FirebaseAuthProviderContext);



  useEffect(() => {
    // if (!cache) {
    // setCache(new Cache(21600, 'cache'))
    // } else {
    // if (__DEV__) {
    cache?.clear();
    // }
    // }
  }, [])

  function addReportUrlAndSubscription(rpts: Report[]): Report[] {
    return rpts.map((x: Report) => ({ ...x, report_url: '', subscribed: false }));
  }

  async function makeApiRequest(path: string, cacheKey?: string) {
    setLoading(true);
    try {
      if (!user) {
        console.log('no user')
        return
      };

      if (cacheKey) {
        const savedResult = await cache?.get(cacheKey);
        if (savedResult) {
          setLoading(false)
          return savedResult.val;
        }
      }

      console.log('MAKING REQUEST TO: ', path)
      const res = await fetch(`${BASE_URI}${path}`, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
      if (!res.ok) {
        throw new Error('Not Found');
      }
      const json = await res.json();

      if (cacheKey) {
        cache?.set(cacheKey, JSON.stringify(json))
      }

      setLoading(false);
      return json;
    }
    catch (e) {
      console.log(e)
      setLoading(false)
      throw new Error(e);
    }
  }

  async function getCommodities() {
    try {
      const commodities = await makeApiRequest('/commodities', 'commodities');
      setCommodities(commodities);
    } catch (e) {
      setLoading(false)
      Alert.alert(e.message)
    }
  }

  const getOffices = async () => {
    try {
      const offices = await makeApiRequest('/offices', 'offices');
      setOffices(offices)
    } catch (e) {
      setLoading(false)
      Alert.alert("Network Error. Please try again later")
    }
  }

  const getMarketTypes = async () => {
    try {
      const marketTypes = await makeApiRequest('/markets', 'markets');
      setMarketTypes(marketTypes);
    } catch (e) {
      setLoading(false)
      Alert.alert("Network Error. Please try again later")
    }
  }

  const buildUri = (igr: IGetReports): string => {
    let uri: string;

    switch (igr.from) {
      case "COMMODITY":
        uri = `/commodities?id=${igr.reportId}`;
        break;
      case "OFFICE":
        uri = `/offices?id=${igr.reportId}`;
        break;
      case "MARKET_TYPE":
        uri = `/markets?id=${igr.reportId}`
        break;
      default:
        uri = `/reports`;
        break;
    }

    return uri;

  }

  async function getReportsForSearch() {

    try {
      console.log('making api request')
      const reports = await makeApiRequest('/reports', 'reportsForSearch');
      setReportsForSeach(reports);

    } catch (e) {
      console.log(e.message)
      Alert.alert("Network Error. Please try again later")
    }

  }

  async function getReports(igr: IGetReports) {
    const uri: string = buildUri(igr);
    const cacheKey = `${igr.from}${igr.reportId}`;
    try {
      const res = await makeApiRequest(uri, cacheKey);
      const reportsWithAdditionalFields = addReportUrlAndSubscription(res.results);
      setReports(reportsWithAdditionalFields);
    } catch (e) {
      setLoading(false);
      Alert.alert("Network Error. Please try again later")
    }
  }

  async function getUri(slg: number) {
    let tempUri: string = `/reportLink?id=_${slg}`
    try {
      const res = await makeApiRequest(tempUri);
      return res.link;
    } catch (e) {
      return false
    }
  }

  async function fetchSummary(slg: number) {
    try {
      const summary = await makeApiRequest(`/report/summary/${slg}`)
      setSummary(summary)
    }
    catch (e) {
      console.log(e)
    }
  }


  return (
    <SearchContext.Provider value={{
      getCommodities,
      getReports,
      getOffices,
      getMarketTypes,
      getReportsForSearch,
      setCurrentReportUrl,
      fetchSummary,
      reportSummary,
      currentReportUrl,
      reportsForSearch,
      offices,
      marketTypes,
      commodities,
      reports,
      loading
    }}>
      {children}
    </SearchContext.Provider>
  )
}