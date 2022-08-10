import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button} from '@rneui/base';
import {ScrollView} from 'react-native-gesture-handler';
import {ReportSummary} from '../../../shared/types';
import {SearchNavProps} from '../SearchStackParams';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {useQuery} from 'react-query';
import {fetchReportSummary} from '../../../queries/reportSummary';
import {StyledText, TextType} from '../../../shared/components/Text';
import {Colors} from '../../../shared/util';

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
          contentContainerStyle={{marginTop: 10, flexGrow: 1, padding: 10}}>
          <StyledText type={TextType.HEADING} value={data.title} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: 15,
              width: '100%',
            }}>
            <Button
              title="View Current Report"
              titleStyle={{fontFamily: 'DM Sans'}}
              buttonStyle={styles.currentReportButton}
              onPress={onCurrentReportPressed}
            />
            <Button
              title="See Previous Reports"
              titleStyle={{color: 'black', fontFamily: 'DM Sans'}}
              buttonStyle={styles.previousReportsButton}
              onPress={() =>
                navigation.navigate('PreviousReports', {
                  report,
                  summary: data,
                })
              }
            />
          </View>
          <StyledText
            value="Market Type"
            type={TextType.SMALL_HEADING}
            style={{fontWeight: 'bold'}}
          />
          <StyledText
            type={TextType.SUB_HEADING}
            style={styles.section}
            value={report.market_types.toString()}
          />
          {data.description ? (
            <>
              <StyledText
                type={TextType.SMALL_HEADING}
                style={{fontWeight: 'bold'}}
                value={'Description'}
              />
              <StyledText
                style={styles.section}
                value={data.description}
                type={TextType.SUB_HEADING}
              />
              <StyledText
                type={TextType.SMALL_HEADING}
                style={{fontWeight: 'bold'}}
                value={'Synopsis'}
              />
              <StyledText
                style={styles.section}
                value={data.synopsis}
                type={TextType.SUB_HEADING}
              />
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.sectionHeader}>No Description Available</Text>
            </View>
          )}
        </ScrollView>
      ) : null}
    </LoadingView>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    margin: 10,
    padding: 5,
  },
  currentReportButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    padding: 10,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    margin: 5,
  },
  previousReportsButton: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.BACKGROUND,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    margin: 5,
  },
});
