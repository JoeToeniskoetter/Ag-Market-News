import React from 'react'
import { Icon, ListItem } from 'react-native-elements';
import { FlatList } from 'react-native';
import { Report } from '../../../shared/types';
import { MonthSelection } from './MonthSelection';

interface YearSelectionProps {

  item: {
    title: string,
    data: string[]
  }
  report: Report

}

export const YearSelection: React.FC<YearSelectionProps> = ({ item, report }) => {
  const data = item.data
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  return (
    <ListItem.Accordion
      bottomDivider
      isExpanded={isExpanded}
      onPress={() => {
        setIsExpanded(!isExpanded)
      }}
      content={
        <>
          <Icon type="Entypo" name="folder" color="#3a7ef2" size={30} style={{ paddingRight: 25 }} />
          <ListItem.Content dataDetectorType={undefined}>
            <ListItem.Title dataDetectorType={undefined} style={{ fontSize: 36 }}>{item.title}</ListItem.Title>
          </ListItem.Content>
        </>
      }
    >
      <FlatList
        data={data}
        keyExtractor={(months) => months.toString()}
        renderItem={(month) => (
          <MonthSelection item={month} year={item.title} report={report} />
        )}
      />
    </ListItem.Accordion>);
}