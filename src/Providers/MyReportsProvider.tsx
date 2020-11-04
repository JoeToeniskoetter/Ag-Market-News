import React, { useState, createContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Report } from './SearchProvider'
import { getReportType } from '../shared/util';
import { Alert } from 'react-native';

export type SavedReport = {
  slug_name: string;
  report_title: string;
}

interface IMyReportsContext {
  reports: Report[] | [];
  
  addReport: (rpt: Report) => void;
  removeReport: (slug_name: string) => void;
  getReports: () => void;
}

export const MyReportsContext = createContext<IMyReportsContext>({
  reports: [],
  addReport: async (rpt: Report) => { },
  removeReport: async (slug_name: string) => { },
  getReports: async () => { }
});


export const MyReportsContextProvider: React.FC<{}> = ({ children }) => {
  const [reports, setReports] = useState<Report[] | []>([]);


  useEffect(()=>{
    getReports();
  }, [])


  async function addReport(rpt: Report) {
    if (!rpt.report_url) {
      try {
        const res = await getReportType(rpt);
        rpt.report_url = res.url;
      } catch (e) {
        return Alert.alert(e.message)
      }
    }

    const stored = await AsyncStorage.getItem("reports");

    let rpts:Report[] = [];

    if (!stored) {
      rpts.push(rpt);
      await AsyncStorage.setItem("reports", JSON.stringify(rpts))
    } else {

      rpts = await JSON.parse(stored as any);

      if (!rpts.some(x => x.slug_name === rpt.slug_name)) {
        rpts.push(rpt)
        await AsyncStorage.setItem("reports", JSON.stringify(rpts))
      } else {
        return;
      }
    }
    setReports(rpts)
  }

  async function removeReport(reportId: string) {
    let stored = await AsyncStorage.getItem("reports");
    let storedToJson: Report[] = await JSON.parse(stored as any);

    const filtered = storedToJson.filter((x) => {
      return x.slug_name !== reportId;
    });

    await AsyncStorage.setItem('reports', JSON.stringify(filtered));

    setReports(filtered);
  }

  async function getReports() {
    const reports = await AsyncStorage.getItem("reports");
    if (!reports) {
      return []
    } else {
      let rpts = JSON.parse(reports);
      setReports(rpts)
    }
  }

  return (
    <MyReportsContext.Provider value={{
      reports,
      addReport,
      removeReport,
      getReports
    }}>
      {children}
    </MyReportsContext.Provider>
  )
}