import React from 'react'
import { View, Text, StatusBar, StyleSheet, SectionList, SectionListData, SectionListRenderItemInfo } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSearch } from '../../../Providers/SearchProvider';
import { BASE_URI } from '../../../shared/util';
import { SearchNavProps } from '../SearchStackParams';

interface PreviousReportsScreenProps {

}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function PreviousReportsScreen({ navigation, route }: SearchNavProps<"PreviousReports">) {
  const { summary, report } = route.params;

  const buildData = () => {
    return summary?.previousReleases.reverse().map(i => ({
      title: i.year,
      data: i.months

    }))
  }

  const fetchPreviousReportData = async (month: string, year: string) => {
    const data = await fetch(`${BASE_URI}/report/get_previous_release/${report.slug_id}?type=month&month=${month}&year=${year}`)
    console.log(await data.json())
  }

  const Item: React.FC<any> = (props) => (
    <ListItem onPress={() => fetchPreviousReportData(props.item, props.section.title)}>
      <ListItem.Title>{monthNames[Number(props.item) - 1]}</ListItem.Title>
      <ListItem.Content>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
  return (
    <View style={{ backgroundColor: 'white', padding: 15 }}>
      <SectionList
        //@ts-ignore
        sections={buildData()}
        keyExtractor={(item, index) => item + index}
        renderItem={(item) => <Item {...item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </View>
  );
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
  }
});
