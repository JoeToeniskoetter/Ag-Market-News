import React, {useState, createContext, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Report} from '../shared/types';
import {getReportType} from '../shared/util';
import {Alert, AppState, AppStateStatus, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {StorageReference} from '../shared/StorageReference';
import {baseFetch, basePost} from '../queries/baseFetch';

interface IMyReportsContext {
  reports: Report[] | [];
  newReports: Report[] | [];
  addReport: (rpt: Report) => void;
  addReportToNew: (rpt: Report) => void;
  fetchNewReports: () => Promise<void>;
  removeReportFromNew: (rpt: Report) => void;
  removeReport: (rpt: Report) => void;
  getReports: () => void;
  reportViewed: (rpt: Report) => void;
  subscribeToReport: (rpt: Report) => void;
  unsubscribeToReport: (rpt: Report) => void;
}

export const MyReportsContext = createContext<IMyReportsContext>({
  reports: [],
  newReports: [],
  addReport: async (rpt: Report) => {},
  addReportToNew: async (rpt: Report) => {},
  fetchNewReports: async () => {},
  removeReportFromNew: async (rpt: Report) => {},
  removeReport: async (rpt: Report) => {},
  getReports: async () => {},
  reportViewed: async (rpt: Report) => {},
  subscribeToReport: async (rpt: Report) => {},
  unsubscribeToReport: async (rpt: Report) => {},
});

export const MyReportsContextProvider: React.FC<{}> = ({children}) => {
  const [reports, setReports] = useState<Report[] | []>([]);
  const [newReports, setNewReports] = useState<Report[] | []>([]);

  useEffect(() => {
    getReports();
  }, []);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    // fetchNewReports();
    const subscription = AppState.addEventListener(
      'change',
      handleNextAppState,
    );
    return () => {
      AppState.removeEventListener('change', handleNextAppState);
    };
  }, []);

  function handleNextAppState(nextAppState: AppStateStatus) {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // fetchNewReports();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  }

  function askToChangePermissions() {
    Alert.alert(
      'Enable Notifications',
      'To subscribe to reports you must enable notifications',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Settings',
          onPress: () => {
            Linking.canOpenURL('app-settings:').then(supported => {
              if (supported) {
                Linking.openSettings();
              }
            });
          },
        },
      ],
      {cancelable: true},
    );
  }

  const fetchNewReports = async () => {
    const reportsToSend = await getViewedReports();
    if (reportsToSend.length === 0) {
      return;
    }
    const payload = {
      reports: reportsToSend,
    };
    const result = await basePost('/reports', {reports: reportsToSend});
    setNewReports(await result.json());
  };

  const createTopic = (rpt: Report): string => {
    return __DEV__ ? `DEV_${rpt.slug_name}` : rpt.slug_name;
  };

  async function subscribeToReport(rpt: Report) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      let newReportList: Report[] = reports.slice(0);
      newReportList.forEach((report: Report) => {
        if (report.slug_name === rpt.slug_name) {
          report.subscribed = true;
        }
      });
      setReports(newReportList);
      await AsyncStorage.setItem(
        StorageReference.REPORTS,
        JSON.stringify(newReportList),
      );
      console.log(createTopic(rpt));
      messaging().subscribeToTopic(createTopic(rpt));
    } else {
      askToChangePermissions();
    }
  }

  async function unsubscribeToReport(rpt: Report) {
    let newReportList: Report[] = reports.slice(0);
    newReportList.forEach((report: Report) => {
      if (report.slug_name === rpt.slug_name) {
        report.subscribed = false;
      }
    });
    setReports(newReportList);
    await AsyncStorage.setItem(
      StorageReference.REPORTS,
      JSON.stringify(newReportList),
    );
    await messaging().unsubscribeFromTopic(createTopic(rpt));
  }

  async function addReport(rpt: Report) {
    if (!rpt.report_url) {
      try {
        const res = await getReportType(rpt);
        rpt.report_url = res.url;
      } catch (e: any) {
        return Alert.alert(e.message);
      }
    }

    const stored = await AsyncStorage.getItem(StorageReference.REPORTS);

    let rpts: Report[] = [];

    if (!stored) {
      rpts.push(rpt);
      await AsyncStorage.setItem(
        StorageReference.REPORTS,
        JSON.stringify(rpts),
      );
    } else {
      rpts = await JSON.parse(stored as any);

      if (!rpts.some(x => x.slug_name === rpt.slug_name)) {
        rpts.push(rpt);
        await AsyncStorage.setItem(
          StorageReference.REPORTS,
          JSON.stringify(rpts),
        );
      } else {
        return;
      }
    }
    setReports(rpts);
  }

  async function removeReport(rpt: Report) {
    let stored = await AsyncStorage.getItem(StorageReference.REPORTS);
    let storedToJson: Report[] = await JSON.parse(stored as any);

    const filtered = storedToJson.filter(x => {
      return x.slug_name !== rpt.slug_name;
    });

    messaging().unsubscribeFromTopic(rpt.slug_name);
    await AsyncStorage.setItem(
      StorageReference.REPORTS,
      JSON.stringify(filtered),
    );
    setReports(filtered);
    removeReportFromViewed(rpt);
  }

  async function getReports() {
    const reports = await AsyncStorage.getItem(StorageReference.REPORTS);
    if (!reports) {
      return [];
    } else {
      let rpts = JSON.parse(reports);
      setReports(rpts);
    }
  }

  async function saveViewedReports(reports: Report[]) {
    await AsyncStorage.setItem(
      StorageReference.REPORTS_LAST_VIEWED,
      JSON.stringify(reports),
    );
  }

  async function reportViewed(report: Report) {
    let viewedReports = await getViewedReports();
    let newRpts = viewedReports.filter(r => r.slug_id !== report.slug_id);
    newRpts.push(report);
    saveViewedReports(newRpts);
  }

  async function removeReportFromViewed(report: Report) {
    let viewedReports = await getViewedReports();
    let newRpts = viewedReports.filter(r => r.slug_id !== report.slug_id);
    saveViewedReports(newRpts);
  }

  async function getViewedReports(): Promise<Report[]> {
    let viewedReports = await AsyncStorage.getItem(
      StorageReference.REPORTS_LAST_VIEWED,
    );
    if (!viewedReports) {
      return [];
    }
    console.log('VIEWED REPORTS ', viewedReports);
    return JSON.parse(viewedReports);
  }

  async function addReportToNew(report: Report) {
    let filteredNewReports = newReports.filter(
      r => r.slug_id !== report.slug_id,
    );
    filteredNewReports.push(report);
    setNewReports(filteredNewReports);
  }

  async function removeReportFromNew(report: Report) {
    let filteredNewReports = newReports.filter(
      r => r.slug_id !== report.slug_id,
    );
    setNewReports(filteredNewReports);
  }

  return (
    <MyReportsContext.Provider
      value={{
        reports,
        newReports,
        addReport,
        addReportToNew,
        removeReportFromNew,
        fetchNewReports,
        removeReport,
        getReports,
        reportViewed,
        subscribeToReport,
        unsubscribeToReport,
      }}>
      {children}
    </MyReportsContext.Provider>
  );
};

export const useMyReports = () => React.useContext(MyReportsContext);
