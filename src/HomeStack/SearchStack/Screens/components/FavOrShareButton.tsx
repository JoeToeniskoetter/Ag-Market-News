import React, {useContext} from 'react';
import { Alert,Platform } from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';
import { MyReportsContext } from '../../../../Providers/MyReportsProvider';
import { Report, SearchContext } from '../../../../Providers/SearchProvider';
import { sendShare } from '../../../../shared/util';

interface IFavOrShareProps{
  report:Report
}

export const FavOrShareButton:React.FC<IFavOrShareProps> = ({report}) => {
  const { addReport, reports } = useContext(MyReportsContext);
  const { currentReportUrl } = useContext(SearchContext);

  if(reports.some(x => x.slug_name == report.slug_name)){
    const reportType = report.report_url?.includes('pdf') ? 'pdf' : 'txt';
    const reportUrl = `https://www.ams.usda.gov/mnreports/${report.slug_name}.${reportType}`;
    const publishedDate = new Date(report.published_date.toString().split(' ')[0]).
  toDateString();

  return (
    <Icon
      name={Platform.OS == "ios" ? "share-apple" : "share-google"}
      color={Platform.OS == "ios" ? 'rgb(0, 122, 255)' : 'black'}
      size={38}
      style={{ paddingRight: 20 }}
      onPress={() => sendShare(`Check out this report! - ${report.report_title}: ${publishedDate}`, reportUrl )}
    />
  )

  }

  return (
    <Button
      title="Favorite"
      type='clear'
      onPress={async () => {
        let curReport = report;
        curReport.report_url = currentReportUrl;
        await addReport(curReport);
        await Alert.alert(`${report.slug_name} Saved to Favorites`)
      }}
      style={{ paddingRight: 20 }}
      titleStyle={{ color: Platform.OS == 'ios' ? '#007aff' : 'black' }}
    />
  )
}