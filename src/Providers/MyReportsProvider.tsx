import React, { useState, createContext, useEffect } from 'react';
import { MyReportsStack } from '../HomeStack/MyReportsStack/MyReportsStack';
import { AsyncStorage } from 'react-native';
import {Report} from './SearchProvider'
import messaging from '@react-native-firebase/messaging';

export type SavedReport = {
  slug_name: string;
  report_title:string;
  subscribed:boolean;
}

interface IMyReportsContext {
  reports: String[] | null;
  addReport: (rpt:Report) => void;
  removeReport: (slug_name: string) => void;
  getReports: () => void;
  subscribeToReport: (rpt: SavedReport) => void;
  unsubscribeToReport: (rpt:SavedReport) => void;
}

export const MyReportsContext = createContext<IMyReportsContext>({
  reports: null,
  addReport: async (rpt:SavedReport) => { },
  removeReport: async (slug_name: string) => { },
  getReports: async () => {},
  subscribeToReport: async (rpt:SavedReport) => {},
  unsubscribeToReport: async (rpt:SavedReport) => {}
});

export const MyReportsContextProvider: React.FC<{}> = ({ children }) => {

  const [reports, setReports] = useState<String[] | null>(null);

  async function addReport(rpt:Report) {
    const stored = await AsyncStorage.getItem("reports");

    if (!stored) {
      const newList = [];
      newList.push(rpt);
      await AsyncStorage.setItem("reports", JSON.stringify(newList))
    } else {

      let storedToJson: SavedReport[] = await JSON.parse(stored as any);

      if(!storedToJson.some(x=>x.slug_name === rpt.slug_name)){
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

  async function subscribeToReport(report:SavedReport){
    console.log('SUBSCRIBING TO REPORT')
    let stored: any = await AsyncStorage.getItem("reports");
    let storedToJson:SavedReport[] = JSON.parse(stored);

    for(let i =0; i<storedToJson.length; i++){
      if((storedToJson[i].slug_name === report.slug_name)&&(storedToJson[i].subscribed === false)){
        storedToJson[i].subscribed = true;
      }  
    }
    await messaging().subscribeToTopic(report.slug_name)
    await AsyncStorage.setItem("reports", JSON.stringify(storedToJson));

  }

  async function unsubscribeToReport(report:SavedReport){
    console.log('UNSUBSCRIBING TO REPORT')
    let stored: any = await AsyncStorage.getItem("reports");
    let storedToJson:SavedReport[] = JSON.parse(stored);

    for(let i =0; i<storedToJson.length; i++){
      if((storedToJson[i].slug_name === report.slug_name)&&(storedToJson[i].subscribed === true)){
        storedToJson[i].subscribed = false;
      }  
    }
    messaging().unsubscribeFromTopic(report.slug_name);
    await AsyncStorage.setItem("reports", JSON.stringify(storedToJson));
  }

  async function getReports():Promise<SavedReport[]>{
    const reports = await AsyncStorage.getItem("reports");
    if(!reports){
      return []
    }else{
      return JSON.parse(reports);
    }
  }

  return (
    <MyReportsContext.Provider value={{
      reports,
      addReport,
      removeReport,
      getReports,
      subscribeToReport,
      unsubscribeToReport
    }}>
      {children}
    </MyReportsContext.Provider>
  )
}