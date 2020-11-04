import React, { useState, createContext, useEffect } from 'react';
import { MyReportsStack } from '../HomeStack/MyReportsStack/MyReportsStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Report } from './SearchProvider'
import { getReportType } from '../shared/util';
import { Alert } from 'react-native';

export type SavedReport = {
  slug_name: string;
  report_title: string;
}

interface IMyReportsContext {
  reports: String[] | null;
  
  addReport: (rpt: Report) => void;
  removeReport: (slug_name: string) => void;
  getReports: () => void;
}

export const MyReportsContext = createContext<IMyReportsContext>({
  reports: null,
  addReport: async (rpt: SavedReport) => { },
  removeReport: async (slug_name: string) => { },
  getReports: async () => { }
});

export const MyReportsContextProvider: React.FC<{}> = ({ children }) => {

  const [reports, setReports] = useState<String[] | null>(null);

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

    if (!stored) {
      const newList = [];
      newList.push(rpt);
      await AsyncStorage.setItem("reports", JSON.stringify(newList))
    } else {

      let storedToJson: SavedReport[] = await JSON.parse(stored as any);

      if (!storedToJson.some(x => x.slug_name === rpt.slug_name)) {
        storedToJson.push(rpt)
        AsyncStorage.setItem("reports", JSON.stringify(storedToJson))
      } else {
        return;
      }
    }
  }

  async function removeReport(reportId: string) {
    let stored: any = await AsyncStorage.getItem("reports");
    let storedToJson: SavedReport[] = await JSON.parse(stored as any);

    const filtered = storedToJson.filter((x) => {
      return x.slug_name !== reportId;
    });

    await AsyncStorage.setItem('reports', JSON.stringify(filtered));

  }

  async function getReports(): Promise<String[]> {
    const reports = await AsyncStorage.getItem("reports");
    if (!reports) {
      return []
    } else {
      return JSON.parse(reports);
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