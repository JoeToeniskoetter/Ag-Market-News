import React, { useState, createContext, useEffect } from 'react';
import { MyReportsStack } from '../HomeStack/MyReportsStack/MyReportsStack';
import { Alert, AsyncStorage } from 'react-native';
import { Report } from './SearchProvider'
import messaging from '@react-native-firebase/messaging';

export type SavedReport = {
  slug_name: string;
  report_title: string;
  subscribed: boolean;
}

interface IMyReportsContext {
  reports: String[] | null;
  storedReports: Report[] | [];
  addReport: (rpt: Report) => void;
  addNewlyPublishedReport: (rpt: Report) => void;
  getNewlyPublishedReports: () => Promise<Report[] | []>;
  removeReport: (slug_name: string) => void;
  getReports: () => void;
  subscribeToReport: (rpt: SavedReport) => void;
  unsubscribeToReport: (rpt: SavedReport) => void;
}

export const MyReportsContext = createContext<IMyReportsContext>({
  reports: null,
  storedReports: [],
  addReport: async (rpt: SavedReport) => { },
  addNewlyPublishedReport: (rpt: Report) => { },
  getNewlyPublishedReports: async () => [],
  removeReport: async (slug_name: string) => { },
  getReports: async () => { },
  subscribeToReport: async (rpt: SavedReport) => { },
  unsubscribeToReport: async (rpt: SavedReport) => { }
});

export const MyReportsContextProvider: React.FC<{}> = ({ children }) => {

  const [reports, setReports] = useState<String[] | null>(null);
  const [storedReports, setStoredReports] = useState<Report[] | []>([]);

  async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();
  
    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  }

  useEffect(()=>{
    requestUserPermission()
  },[])

  useEffect(()=>{
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert("New Report available")
      if(remoteMessage.data && remoteMessage.data.report) {
        let newReport:Report = JSON.parse(remoteMessage.data.report);
        addNewlyPublishedReport(newReport);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(()=>{
    getNewlyPublishedReports();
  },[])


  async function addNewlyPublishedReport(rpt: Report) {
    const stored = await AsyncStorage.getItem("newlyPublishedReports");

    if (!stored) {
      console.log('NOTHING STORED')
      const newlyPublishedReports = [];
      newlyPublishedReports.push(rpt);
      setStoredReports(newlyPublishedReports)
      await AsyncStorage.setItem("newlyPublishedReports", JSON.stringify(newlyPublishedReports));
    } else {
      console.log('STORED REPORTS', stored)
      const newlyPublishedReports: Report[] = await JSON.parse(stored);
      newlyPublishedReports.push(rpt);
      setStoredReports(newlyPublishedReports);
      await AsyncStorage.setItem("newlyPublishedReports", JSON.stringify(newlyPublishedReports));
    }

  }

  async function getNewlyPublishedReports(): Promise<Report[] | []>{
    const stored = await AsyncStorage.getItem("newlyPublishedReports");

    if(!stored){
      return [];
    }
    let savedRpts = await JSON.parse(stored);
    await setStoredReports(savedRpts);
    return savedRpts;

  }

  async function addReport(rpt: Report) {
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

  async function subscribeToReport(report: SavedReport) {
    console.log('SUBSCRIBING TO REPORT')
    let stored: any = await AsyncStorage.getItem("reports");
    let storedToJson: SavedReport[] = JSON.parse(stored);

    for (let i = 0; i < storedToJson.length; i++) {
      if ((storedToJson[i].slug_name === report.slug_name) && (storedToJson[i].subscribed === false)) {
        storedToJson[i].subscribed = true;
      }
    }
    await messaging().subscribeToTopic(report.slug_name)
    await AsyncStorage.setItem("reports", JSON.stringify(storedToJson));

  }

  async function unsubscribeToReport(report: SavedReport) {
    console.log('UNSUBSCRIBING TO REPORT')
    let stored: any = await AsyncStorage.getItem("reports");
    let storedToJson: SavedReport[] = JSON.parse(stored);

    for (let i = 0; i < storedToJson.length; i++) {
      if ((storedToJson[i].slug_name === report.slug_name) && (storedToJson[i].subscribed === true)) {
        storedToJson[i].subscribed = false;
      }
    }
    messaging().unsubscribeFromTopic(report.slug_name);
    await AsyncStorage.setItem("reports", JSON.stringify(storedToJson));
  }

  async function getReports(): Promise<SavedReport[]> {
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
      storedReports,
      addReport,
      addNewlyPublishedReport,
      getNewlyPublishedReports,
      removeReport,
      getReports,
      subscribeToReport,
      unsubscribeToReport
    }}>
      {children}
    </MyReportsContext.Provider>
  )
}