import React, { createContext, useState, Dispatch, SetStateAction } from 'react';
import { Alert } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'

export type Commodity = {
  commodity_name: String,
  commodity_lov_id: Number
}

export type ReportForSeach = {
  slug_name: string,
  report_title: string
}

export type MarketType = {
  market_type:string,
  market_type_id:string
}

export type Report = {
    slug_id: Number,
    slug_name: string,
    report_title: string,
    published_date: Date,
    markets: String[],
    market_types: String[],
    offices: String[],
    sectionNames: String[],
    report_name: String,
    report_url: string | undefined
  }

type IGetReports = {
  from: String,
  reportId: string
}

export type Office = {
  office_name: string,
  office_code: string
}

interface ISearchProvder {
  getCommodities: () => void;
  getReports: (igr: IGetReports) => void;
  getOffices:() => void;
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
  getOffices: async () => {},
  getReports: async (igr: IGetReports) => { },
  getMarketTypes: async () => {},
  getReportsForSearch: async () => {},
  setCurrentReportUrl: () => {},
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

  RNFetchBlob.config({
    trusty:true
  });

  let BASEURI:string = 'https://joetoeniskoetter.com/api/ag-market-news';


  function addReportUrl(rpts:Report[]):Report[]{
    return rpts.map((x:Report) => ({ ...x, report_url: '' }));
  }

  async function getCommodities() {

    setLoading(true);

    try {
      const res = await fetch(`${BASEURI}/commodities`, {
        headers:{
          accept: 'application/json'
        },
        body:null
      });
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

  const getOffices = async () => {

    setLoading(true);
    try {
      const res = await fetch(`${BASEURI}/offices`);
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
      const res = await fetch(`${BASEURI}/market-types`);
      const json = await res.json();
      setLoading(false);
      setMarketTypes(json);
    } catch (e) {
      setLoading(false)
      Alert.alert("Network Error. Please try again later")
    }
  }

  const buildUri = (igr:IGetReports): String => {

    let uri: String;
  
    switch (igr.from) {
      case "COMMODITY":
        uri = `${BASEURI}/commodities/${igr.reportId}`;
        break;
      case "OFFICE":
        uri = `${BASEURI}/offices/${igr.reportId}`;
        break;
      case "MARKET_TYPE":
        uri = `${BASEURI}/market-types/${igr.reportId}`
        break;
      default:
        uri = '';
        break;
    }
  
    return uri;

  }
  
  async function getReportsForSearch(){
    setLoading(true);
    try {
      const res = await fetch(`${BASEURI}/reports`);
      const json = await res.json();
      setLoading(false);
      setReportsForSeach(addReportUrl(json));
    } catch (e) {
      console.log(e.message)
      Alert.alert("Network Error. Please try again later")
      setLoading(false)
    }
  }

  async function getReports(igr: IGetReports) {
    const uri:String = buildUri(igr);
    setLoading(true);
    try {
      const res = await fetch(uri as any);
      const json = await res.json();
      setReports(addReportUrl(json.results));
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