import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Report} from '../shared/types';

export const useRecentReports = () => {
  const [recentReportsLoading, setRecentReportsLoading] = useState<boolean>(
    false,
  );
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const getRecentReports = async (refresh: boolean = false) => {
    refresh ? setRefreshing(true) : setRecentReportsLoading(true);
    try {
      const reports = await firestore()
        .collection('reports')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get({source: 'server'});
      const data = reports.docs.map(doc => doc.data() as Report);
      setRecentReports(data);
    } catch (e: any) {
      console.log(e);
    }
    refresh ? setRefreshing(false) : setRecentReportsLoading(false);
  };

  useEffect(() => {
    try {
      setRecentReportsLoading(true);
      getRecentReports();
    } catch (e) {
    } finally {
      setRecentReportsLoading(false);
    }
  }, []);

  return {recentReports, recentReportsLoading, refreshing, getRecentReports};
};
