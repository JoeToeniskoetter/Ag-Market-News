import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, FlatList, View} from 'react-native';
import {Icon, ListItem} from '@rneui/base';
import {
  PreviousReports,
  PreviousReportsData,
  Report,
} from '../../../shared/types';
import {BASE_URI} from '../../../shared/util';
import {LoadingView} from '../../sharedComponents/LoadingSpinner';
import auth from '@react-native-firebase/auth';

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
  const [previousReportData, setPreviousReportData] =
    React.useState<PreviousReportsData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  // const year = item.section.title;
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
          <ListItem.Title>{`Date: ${item.report_date}`}</ListItem.Title>
          <ListItem.Subtitle style={{fontWeight: 'bold', color: 'green'}}>
            {item.file_extension}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  const fetchPreviousReportData = async () => {
    setLoading(true);
    try {
      const data = await fetch(
        `${BASE_URI}/report/get_previous_release/${report.slug_id}?type=month&month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${await auth().currentUser?.getIdToken()}`,
          },
        },
      );
      console.log(data);
      setPreviousReportData((await data.json()) as PreviousReportsData);
    } catch (e: any) {
      Alert.alert(e.message);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <ListItem.Accordion
      isExpanded={expanded}
      onPress={() => {
        if (!previousReportData) {
          fetchPreviousReportData();
        }
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
            <ListItem.Title>{monthNames[Number(item.item) - 1]}</ListItem.Title>
          </ListItem.Content>
        </>
      }>
      <LoadingView loading={loading} width={50} height={50}>
        <FlatList
          keyExtractor={(item: PreviousReports) => item.document_url.toString()}
          data={previousReportData?.data}
          renderItem={({item}) => <PreviousReportItem item={item} />}
        />
      </LoadingView>
    </ListItem.Accordion>
  );
};
