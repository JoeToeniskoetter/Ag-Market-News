import React, { createContext, useState, Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { Office, Commodity, MarketType, Report } from '../shared/types';
import { FirebaseAuthProvider, FirebaseAuthProviderContext } from './FirebaseAuthProvider';
import { Cache } from '../shared/Cache';

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

  const { state: { user } } = useContext(FirebaseAuthProviderContext);

  let BASEURI: string = __DEV__ ? 'http://localhost:5001/ag-market-news-74525/us-central1/api' : 'https://us-central1-ag-market-news-74525.cloudfunctions.net/api';

  useEffect(() => {
    if (!cache) {
      setCache(new Cache(21600, 'cache'))
    }
  }, [])

  function addReportUrlAndSubscription(rpts: Report[]): Report[] {
    return rpts.map((x: Report) => ({ ...x, report_url: '', subscribed: false }));
  }

  async function getCommodities() {
    setLoading(true);
    const savedResult = await cache?.get("commodities");
    if (savedResult) {
      setCommodities(JSON.parse(savedResult.val));
      setLoading(false);
      return
    }
    if (user) {
      const token = await user.getIdToken()
      try {
        const res = await fetch(`${BASEURI}/commodities`, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
        const json = await res.json();
        setLoading(false);
        setCommodities(json);
        cache?.set("commodities", JSON.stringify(json))
      } catch (e) {
        console.log(e)
        setLoading(false)
        Alert.alert(e.message)
      }
    }
  }

  const getOffices = async () => {
    setLoading(true);
    const savedResult = await cache?.get("offices");
    if (savedResult) {
      setOffices(JSON.parse(savedResult.val));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASEURI}/offices`, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
      const json = await res.json();
      setLoading(false);
      setOffices(json);
      cache?.set("offices", JSON.stringify(json));
    } catch (e) {
      setLoading(false)
      Alert.alert("Network Error. Please try again later")
      console.log(e)
    }
  }

  const getMarketTypes = async () => {
    setLoading(true);

    const savedResult = await cache?.get("markets");
    if (savedResult) {
      setLoading(false);
      setMarketTypes(JSON.parse(savedResult.val))
      return
    }

    try {
      const res = await fetch(`${BASEURI}/markets`, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
      const json = await res.json();
      setLoading(false);
      setMarketTypes(json);
    } catch (e) {
      setLoading(false)
      Alert.alert("Network Error. Please try again later")
    }
  }

  const buildUri = (igr: IGetReports): string => {
    let uri: string;

    switch (igr.from) {
      case "COMMODITY":
        uri = `${BASEURI}/commodities?id=${igr.reportId}`;
        break;
      case "OFFICE":
        uri = `${BASEURI}/offices?id=${igr.reportId}`;
        break;
      case "MARKET_TYPE":
        uri = `${BASEURI}/markets?id=${igr.reportId}`
        break;
      default:
        uri = `${BASEURI}/reports`;
        break;
    }

    return uri;

  }

  async function getReportsForSearch() {
    setLoading(true);

    const savedResult = await cache?.get("reportsForSearch");

    if (savedResult) {
      setReportsForSeach(JSON.parse(savedResult.val))
      setLoading(false);
      return
    }

    try {
      const res = await fetch(`${BASEURI}/reports`, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
      const json = await res.json();
      setLoading(false);
      setReportsForSeach(addReportUrlAndSubscription(json));
      cache?.set("reportsForSearch", JSON.stringify(json))
    } catch (e) {
      console.log(e.message)
      Alert.alert("Network Error. Please try again later")
      setLoading(false)
    }
  }

  async function getReports(igr: IGetReports) {
    const uri: string = buildUri(igr);

    setLoading(true);
    const cacheKey = `${igr.from}${igr.reportId}`;
    const savedResult = await cache?.get(cacheKey);
    if (savedResult) {
      setReports(JSON.parse(savedResult.val))
      setLoading(false);
      return
    }

    try {
      const res = await fetch(uri as any, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
      const json = await res.json();
      const reportsWithAdditionalFields = addReportUrlAndSubscription(json.results);
      setReports(reportsWithAdditionalFields);
      setLoading(false);
      cache?.set(cacheKey, JSON.stringify(reportsWithAdditionalFields));
    } catch (e) {
      setLoading(false);
      Alert.alert("Network Error. Please try again later")
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