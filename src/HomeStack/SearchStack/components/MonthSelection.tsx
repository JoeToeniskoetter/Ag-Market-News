import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {Icon, ListItem} from '@rneui/base';
import {
  PreviousReports,
  PreviousReportsData,
  Report,
} from '../../../shared/types';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import {useQuery} from 'react-query';
import {fetchPreviousReleases} from '../../../queries/previousReports';
import {StyledText, TextType} from '../../../shared/components/Text';

interface MonthSelectionProps {
  item: any;
  year: string;
  report: Report;
}

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

export const MonthSelection: React.FC<MonthSelectionProps> = ({
  item,
  report,
  year,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const {data, isLoading, error, refetch} = useQuery<
    PreviousReportsData,
    Error
  >(
    `/previousReports/${report.slug_id}/${item.item}/${year}`,
    () => fetchPreviousReleases(report.slug_id, month, year),
    {enabled: expanded},
  );
  const month = item.item;
  const navigation = useNavigation();
  // const { report, month, year } = route.params;

  const buildUri = (documentUrl: string) => {
    let tempUri: string = '';
    if (documentUrl.includes('https')) {
      tempUri = documentUrl;
    } else {
      tempUri = 'https://mymarketnews.ams.usda.gov' + documentUrl;
    }
    return tempUri;
  };

  const PreviousReportItem: React.FC<{item: PreviousReports}> = ({item}) => {
    return (
      <ListItem
        bottomDivider
        onPress={async () => {
          const uri = buildUri(item.document_url);
          const reportWithNewDate = Object.assign({}, report);
          //@ts-ignore
          reportWithNewDate.published_date = item.report_date;
          navigation.navigate('PDFView', {report: reportWithNewDate, uri});
        }}
        containerStyle={{paddingLeft: 25}}>
        <ListItem.Content>
          <ListItem.Title>
            <StyledText
              type={TextType.SUB_HEADING}
              style={{fontSize: 14}}
              value={`Date: ${item.report_date}`}
            />
          </ListItem.Title>
          <ListItem.Subtitle style={{fontWeight: 'bold', color: 'green'}}>
            {item.file_extension}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  return (
    <ListItem.Accordion
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
      content={
        <>
          <Icon
            name="calendar"
            type="entypo"
            color="#b34836"
            style={{paddingRight: 20}}
          />
          <ListItem.Content>
            <ListItem.Title>
              <StyledText
                value={monthNames[Number(item.item) - 1]}
                type={TextType.SMALL_HEADING}
              />
            </ListItem.Title>
          </ListItem.Content>
        </>
      }>
      <LoadingView loading={isLoading} width={50} height={50}>
        <FlatList
          keyExtractor={(item: PreviousReports) => item.document_url.toString()}
          data={data?.data}
          renderItem={({item}) => <PreviousReportItem item={item} />}
        />
      </LoadingView>
    </ListItem.Accordion>
  );
};
