import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button} from '@rneui/base';
import {ScrollView} from 'react-native-gesture-handler';
import {Report, ReportSummary} from '../../../shared/types';
import {SearchNavProps} from '../SearchStackParams';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {useQuery} from 'react-query';
import {fetchReportSummary} from '../../../queries/reportSummary';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function SummaryScreen({navigation, route}: SearchNavProps<'Summary'>) {
  const {data, isLoading, error} = useQuery<ReportSummary, Error>(
    `/report/summary/${route.params.report.slug_id}`,
    () => fetchReportSummary(route.params.report.slug_id),
  );
  const {report} = route.params;

  const onCurrentReportPressed = () => {
    navigation.navigate('PDFView', {report: route.params.report});
  };

  return (
    <LoadingView loading={isLoading}>
      {data ? (
        <ScrollView
          style={styles.summaryContainer}
          contentContainerStyle={{marginTop: 10, height: '110%'}}>
          <Text style={styles.title}>{report.report_title}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingVertical: 5,
            }}>
            <Button
              title="View Current Report"
              buttonStyle={styles.currentReportButton}
              onPress={onCurrentReportPressed}
            />
            <Button
              title="See Previous Reports"
              buttonStyle={styles.previousReportsButton}
              onPress={() =>
                navigation.navigate('PreviousReports', {
                  report,
                  summary: data,
                })
              }
            />
          </View>
          <Text style={styles.sectionHeader}>Market Type</Text>
          <Text style={styles.section}>{report.market_types}</Text>
          {data.description ? (
            <>
              <Text style={styles.sectionHeader}>Description</Text>
              <Text style={styles.section}>{data.description}</Text>
              <Text style={styles.sectionHeader}>Synopsis</Text>
              <Text style={styles.section}>{data.synopsis}</Text>
            </>
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.sectionHeader}>No Description Available</Text>
            </View>
          )}
        </ScrollView>
      ) : null}
    </LoadingView>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
    backgroundColor: '#fff',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 15,
  },
  section: {
    fontSize: 16,
  },
  currentReportButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10,
  },
  previousReportsButton: {
    borderRadius: 10,
    padding: 10,
  },
});
