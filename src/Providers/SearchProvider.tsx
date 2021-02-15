import React, { createContext, useState, Dispatch, SetStateAction, useContext } from 'react';
import { Alert } from 'react-native';
import { Office, Commodity, MarketType, Report } from '../shared/types';
import { FirebaseAuthProvider, FirebaseAuthProviderContext } from './FirebaseAuthProvider';


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

  const { state: { user } } = useContext(FirebaseAuthProviderContext);

  const fetchOptions = {
    headers: {
      Authorization: `Bearer  ${user?.getIdToken()}`
    }
  }

  let BASEURI = 'https://us-central1-ag-market-news-74525.cloudfunctions.net/api'

  // let BASEURI: string = __DEV__ ? 'https://joetoeniskoetter.com/api/ag-market-news' : 'http://192.168.1.13:5000/api/ag-market-news';

  function addReportUrlAndSubscription(rpts: Report[]): Report[] {
    return rpts.map((x: Report) => ({ ...x, report_url: '', subscribed: false }));
  }

  async function getCommodities() {

    setLoading(true);
    if (user) {
      const token = await user.getIdToken()
      try {
        const res = await fetch(`${BASEURI}/commodities`, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
        const json = await res.json();
        console.log(res)
        setLoading(false);
        setCommodities(json);
      } catch (e) {
        console.log(e)
        setLoading(false)
        Alert.alert(e.message)
      }
    }
  }

  const getOffices = async () => {

    setLoading(true);
    try {
      const res = await fetch(`${BASEURI}/offices`, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
      const json = await res.json();
      setLoading(false);
      setOffices(json);
    } catch (e) {
      setLoading(false)
      Alert.alert("Network Error. Please try again later")
      console.log(e)
    }
  }

  const getMarketTypes = async () => {
    setLoading(true);
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

  const buildUri = (igr: IGetReports): String => {
    let uri: String;

    switch (igr.from) {
      case "COMMODITY":
        uri = `${BASEURI}/commodities?id=${igr.reportId}`;
        console.log(uri)
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
    try {
      const res = await fetch(`${BASEURI}/reports`, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
      const json = await res.json();
      setLoading(false);
      setReportsForSeach(addReportUrlAndSubscription(json));

    } catch (e) {
      console.log(e.message)
      Alert.alert("Network Error. Please try again later")
      setLoading(false)
    }
  }

  async function getReports(igr: IGetReports) {
    const uri: String = buildUri(igr);
    setLoading(true);
    try {
      const res = await fetch(uri as any, { headers: { Authorization: `Bearer ${await user?.getIdToken()}` } });
      const json = await res.json();
      setReports(addReportUrlAndSubscription(json.results));
      setLoading(false);
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