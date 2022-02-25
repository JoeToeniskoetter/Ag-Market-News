import React from 'react'
import { ActivityIndicator, Picker, SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchContext, useSearch } from '../../../Providers/SearchProvider';
import { Report } from '../../../shared/types';
import { SearchNavProps } from '../SearchStackParams';
import LottieView from 'lottie-react-native';
import { LoadingSpinner } from '../../sharedComponents/LoadingSpinner';

interface SummaryScreenProps {
  report: Report
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function SummaryScreen({ navigation, route }: SearchNavProps<"Summary">) {
  const { reportSummary, fetchSummary, loading } = useSearch();
  const { report } = route.params;

  React.useEffect(() => {
    fetchSummary(route.params.report.slug_id);
  }, [route.params.report.slug_id])

  const onCurrentReportPressed = () => {
    navigation.navigate("PDFView", { report: route.params.report })
  }

  if (loading) {
    return (
      <LoadingSpinner />
    )
  }

  if (reportSummary) {
    return (
      <ScrollView style={styles.summaryContainer} contentContainerStyle={{ marginTop: 10, height: '110%' }}>
        <Text style={styles.title}>{report.report_title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 5 }}>
          <Button title="View Current Report" buttonStyle={styles.currentReportButton} onPress={onCurrentReportPressed} />
          <Button title="See Previous Reports" buttonStyle={styles.previousReportsButton} onPress={() => navigation.navigate("PreviousReports", { report, summary: reportSummary })} />
        </View>
        <Text style={styles.sectionHeader}>Market Type</Text>
        <Text style={styles.section}>{report.market_types}</Text>
        {reportSummary.description ?
          (<>
            <Text style={styles.sectionHeader}>Description</Text>
            <Text style={styles.section}>{reportSummary.description}</Text>
            <Text style={styles.sectionHeader}>Synopsis</Text>
            <Text style={styles.section}>{reportSummary.synopsis}</Text>
          </>)
          : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.sectionHeader}>No Description Available</Text>
            </View>
          )
        }
      </ScrollView>
    )
  }

  return (null);
}


const styles = StyleSheet.create({
  summaryContainer: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
    backgroundColor: "#fff"
  },
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: "#fff"

  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
    paddingBottom: 10
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 15
  },
  section: {
    fontSize: 16
  },
  currentReportButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10
  },
  previousReportsButton: {
    borderRadius: 10,
    padding: 10
  }
});
