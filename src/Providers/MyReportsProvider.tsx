import React, { useState, createContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Report } from '../shared/types';
import { getReportType } from '../shared/util';
import { Alert, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { StorageReference } from '../shared/StorageReference'


interface IMyReportsContext {
  reports: Report[] | [];
  addReport: (rpt: Report) => void;
  removeReport: (rpt: Report) => void;
  getReports: () => void;
  subscribeToReport: (rpt: Report) => void;
  unsubscribeToReport: (rpt: Report) => void;
}

export const MyReportsContext = createContext<IMyReportsContext>({
  reports: [],
  addReport: async (rpt: Report) => { },
  removeReport: async (rpt: Report) => { },
  getReports: async () => { },
  subscribeToReport: async (rpt: Report) => { },
  unsubscribeToReport: async (rpt: Report) => { }
});


export const MyReportsContextProvider: React.FC<{}> = ({ children }) => {
  const [reports, setReports] = useState<Report[] | []>([]);


  useEffect(() => {
    getReports();
  }, [])

  function askToChangePermissions() {

    Alert.alert(
      "Enable Notifications",
      "To subscribe to reports you must enable notifications",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Settings", onPress: () => {
            Linking.canOpenURL('app-settings:').then(supported => {
              if (supported) {
                Linking.openSettings()
              }
            })
          }
        }
      ],
      { cancelable: true }
    );

  }

  const createTopic = (rpt: Report): string => {
    return __DEV__ ? `DEV_${rpt.slug_name}` : rpt.slug_name;
  }

  async function subscribeToReport(rpt: Report) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      let newReportList: Report[] = reports.slice(0);
      newReportList.forEach((report: Report) => {
        if (report.slug_name === rpt.slug_name) {
          report.subscribed = true
        }
      });
      setReports(newReportList)
      await AsyncStorage.setItem(StorageReference.REPORTS, JSON.stringify(newReportList))
      console.log(createTopic(rpt))
      messaging().subscribeToTopic(createTopic(rpt));
    } else {
      askToChangePermissions();
    }
  }

  async function unsubscribeToReport(rpt: Report) {
    let newReportList: Report[] = reports.slice(0);
    newReportList.forEach((report: Report) => {
      if (report.slug_name === rpt.slug_name) {
        report.subscribed = false
      }
    });
    setReports(newReportList)
    await AsyncStorage.setItem(StorageReference.REPORTS, JSON.stringify(newReportList))
    await messaging().unsubscribeFromTopic(createTopic(rpt));
  }



  async function addReport(rpt: Report) {
    if (!rpt.report_url) {
      try {
        const res = await getReportType(rpt);
        rpt.report_url = res.url;
      } catch (e) {
        return Alert.alert(e.message)
      }
    }

    const stored = await AsyncStorage.getItem(StorageReference.REPORTS);

    let rpts: Report[] = [];

    if (!stored) {
      rpts.push(rpt);
      await AsyncStorage.setItem(StorageReference.REPORTS, JSON.stringify(rpts))
    } else {

      rpts = await JSON.parse(stored as any);

      if (!rpts.some(x => x.slug_name === rpt.slug_name)) {
        rpts.push(rpt)
        await AsyncStorage.setItem(StorageReference.REPORTS, JSON.stringify(rpts))
      } else {
        return;
      }
    }
    setReports(rpts)
  }

  async function removeReport(rpt: Report) {
    let stored = await AsyncStorage.getItem(StorageReference.REPORTS);
    let storedToJson: Report[] = await JSON.parse(stored as any);

    const filtered = storedToJson.filter((x) => {
      return x.slug_name !== rpt.slug_name;
    });

    messaging().unsubscribeFromTopic(rpt.slug_name);
    await AsyncStorage.setItem(StorageReference.REPORTS, JSON.stringify(filtered));
    setReports(filtered);
  }

  async function getReports() {
    const reports = await AsyncStorage.getItem(StorageReference.REPORTS);
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
      getReports,
      subscribeToReport,
      unsubscribeToReport
    }}>
      {children}
    </MyReportsContext.Provider>
  )
}

export const useMyReports = () => React.useContext(MyReportsContext);