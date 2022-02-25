import React from 'react'
import { View, FlatList } from 'react-native';
import { SearchNavProps } from '../SearchStackParams';
import { YearSelection } from '../components/YearSelection';

export function PreviousReportsScreen({ navigation, route }: SearchNavProps<"PreviousReports">) {
  const { summary, report } = route.params;

  const buildData = () => {
    return summary?.previousReleases.map(i => ({
      title: i.year,
      data: i.months
    })).sort((a, b) => Number(b.title) - Number(a.title))
  }

  return (

    <FlatList
      showsVerticalScrollIndicator={false}
      //@ts-ignore
      data={buildData()}
      keyExtractor={(item, index) => item.title}
      renderItem={({ item }) => (
        <YearSelection item={item} report={report} />
      )}
    />
  )
}