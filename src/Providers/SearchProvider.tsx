import React, {createContext, useState, Dispatch, SetStateAction} from 'react';
import {Alert} from 'react-native';
import {
  Office,
  Commodity,
  MarketType,
  Report,
  ReportSummary,
} from '../shared/types';
import {useFirebaseAuth} from './FirebaseAuthProvider';
import {BASE_URI} from '../shared/util';

type IGetReports = {
  from: String;
  reportId: string;
};

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
  loading: boolean;
  reports: Report[] | null;
  offices: Office[] | null;
  marketTypes: MarketType[] | null;
}

export const SearchContext = createContext<ISearchProvder>({
  getCommodities: async () => {},
  getOffices: async () => {},
  getReports: async (igr: IGetReports) => {},
  getMarketTypes: async () => {},
  getReportsForSearch: async () => {},
  setCurrentReportUrl: () => {},
  fetchSummary: (slg: number) => {},
  reportSummary: null,
  currentReportUrl: undefined,
  reportsForSearch: null,
  commodities: null,
  loading: false,
  reports: null,
  offices: null,
  marketTypes: null,
});

export const SearchProvider: React.FC<{}> = ({children}) => {
  const [commodities, setCommodities] = useState<Commodity[] | null>(null);
  const [marketTypes, setMarketTypes] = useState<MarketType[] | null>(null);
  const [offices, setOffices] = useState<Office[] | null>(null);
  const [reports, setReports] = useState<Report[] | null>(null);
  const [reportsForSearch, setReportsForSeach] = useState<Report[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [currentReportUrl, setCurrentReportUrl] = useState<string>();
  const [reportSummary, setSummary] = useState(null);

  const {user} = useFirebaseAuth();

  function addReportUrlAndSubscription(rpts: Report[]): Report[] {
    return rpts.map((x: Report) => ({...x, report_url: '', subscribed: false}));
  }

  async function makeApiRequest(path: string) {
    setLoading(true);
    let bearerToken = await user?.getIdToken().catch(e => {
      console.log(`Error Getting Token: ${e}`);
    });

    console.log('BEARER TOKEN: ', bearerToken);
    try {
      if (!user) {
        throw new Error('No User');
      }
      const url = `${BASE_URI}${path}`;

      console.log('Requesting: ', url);

      const res = await fetch(url, {
        headers: {Authorization: `Bearer ${bearerToken}`},
      });
      if (!res.ok) {
        throw new Error('Not Found');
      }
      const json = await res.json();

      setLoading(false);
      return json;
    } catch (e) {
      console.log('MAKE API REQUEST ERROR: ', e);
      setLoading(false);
      throw new Error('An Unknown Error Occurred');
    }
  }

  async function getCommodities() {
    try {
      const commodities = await makeApiRequest('/commodities');
      setCommodities(commodities);
      console.log(commodities);
    } catch (e) {
      console.log('ERROR FETCHING COMMODITIES: ', e);
      setLoading(false);
      Alert.alert('Error Fetching Commodities');
    }
  }

  const getOffices = async () => {
    try {
      const offices = await makeApiRequest('/offices');
      setOffices(offices);
    } catch (e) {
      console.log(e);
      setLoading(false);
      Alert.alert('Network Error. Please try again later');
    }
  };

  const getMarketTypes = async () => {
    try {
      const marketTypes = await makeApiRequest('/markets');
      setMarketTypes(marketTypes);
    } catch (e) {
      setLoading(false);
      Alert.alert('Network Error. Please try again later');
    }
  };

  const buildUri = (igr: IGetReports): string => {
    let uri: string;

    switch (igr.from) {
      case 'COMMODITY':
        uri = `/commodities?id=${igr.reportId}`;
        break;
      case 'OFFICE':
        uri = `/offices?id=${igr.reportId}`;
        break;
      case 'MARKET_TYPE':
        uri = `/markets?id=${igr.reportId}`;
        break;
      default:
        uri = `/reports`;
        break;
    }

    return uri;
  };

  async function getReportsForSearch() {
    try {
      console.log('making api request');
      const reports = await makeApiRequest('/reports');
      setReportsForSeach(reports);
    } catch (e) {
      console.log('Error Fetching Reports');
      Alert.alert('Network Error. Please try again later');
    }
  }

  async function getReports(igr: IGetReports) {
    const uri: string = buildUri(igr);
    try {
      const res = await makeApiRequest(uri);
      const reportsWithAdditionalFields = addReportUrlAndSubscription(
        res.results,
      );
      setReports(reportsWithAdditionalFields);
    } catch (e) {
      setLoading(false);
      Alert.alert('Network Error. Please try again later');
    }
  }

  async function getUri(slg: number) {
    let tempUri: string = `/reportLink?id=_${slg}`;
    try {
      const res = await makeApiRequest(tempUri);
      return res.link;
    } catch (e) {
      return false;
    }
  }

  async function fetchSummary(slg: number) {
    try {
      const summary = await makeApiRequest(`/report/summary/${slg}`);
      console.log(summary);
      setSummary(summary);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <SearchContext.Provider
      value={{
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
        loading,
      }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => React.useContext(SearchContext);
