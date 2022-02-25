import React, { useState, useEffect } from 'react'
import { Report } from '../../../shared/types';
import firestore from '@react-native-firebase/firestore';
import { Alert, FlatList, Text } from 'react-native';
import { LoadingView } from '../../sharedComponents/LoadingSpinner';
import { Icon, ListItem } from 'react-native-elements';
import { SearchNavProps } from '../SearchStackParams';

export function RecentReports({ navigation, route }: SearchNavProps<"RecentReports">) {
  const [recentReportsLoading, setRecentReportsLoading] = useState<boolean>(false);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  const getRecentReports = async () => {
    setRecentReportsLoading(true);
    try {
      console.log("getting recent reports")
      const reports = await firestore()
        .collection("reports")
        .orderBy("timestamp", "desc")
        .limit(10)
        .get({ source: 'server' });
      const data = reports.docs.map(doc => doc.data() as Report);
      setRecentReports(data)
    } catch (e: any) {
      console.log(e)
      Alert.alert(e.message)
    }
    setRecentReportsLoading(false);
  }

  useEffect(() => {
    getRecentReports()
  }, [])


  return (
    <LoadingView loading={recentReportsLoading}>
      <FlatList
        contentContainerStyle={{ backgroundColor: 'white' }}
        data={recentReports}
        keyExtractor={(report) => report.slug_name}
        renderItem={({ item }) => {
          return (
            <ListItem
              bottomDivider
              onPress={() => {
                navigation.navigate("PDFView", { report: item })
              }}
            >
              <Icon name="file-text" type="feather" size={24} color={"green"} />
              <ListItem.Content>
                <ListItem.Title>{item.report_title}</ListItem.Title>
                <ListItem.Subtitle style={{ fontWeight: 'bold' }}>{`Updated at: ${item.timestamp.toDate().toUTCString()}`}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )
        }}
      />
    </LoadingView>
  );
}