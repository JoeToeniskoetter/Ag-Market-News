import React from 'react'
import { ActivityIndicator, Picker, SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SearchContext } from '../../../Providers/SearchProvider';
import { Report } from '../../../shared/types';
import { SearchNavProps } from '../SearchStackParams';

interface SummaryScreenProps {
  report: Report
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function SummaryScreen({ navigation, route }: SearchNavProps<"Summary">) {
  const { reportSummary, fetchSummary, loading } = React.useContext(SearchContext);
  const { report } = route.params;

  React.useEffect(() => {
    fetchSummary(route.params.report.slug_id);
  }, [route.params.report.slug_id])

  if (loading) {
    return <ActivityIndicator size="large" color="black" />
  }

  const Item: React.FC<{ item: string }> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{monthNames[Number(item) - 1]}</Text>
    </View>
  );

  if (reportSummary) {
    const buildData = () => {
      return reportSummary?.previousReleases.map(i => ({
        title: i.year,
        data: i.months
      }))
    }
    return (
      <>
        <Text>{report.report_title}</Text>
        <Text>{report.market_types}</Text>
        <Text>{reportSummary.description}</Text>
        <Text>{reportSummary.synopsis}</Text>
        <SectionList
          sections={buildData()}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
      </>
    )
  }

  return (null);
}


const styles = StyleSheet.create({
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
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24
  }
});
