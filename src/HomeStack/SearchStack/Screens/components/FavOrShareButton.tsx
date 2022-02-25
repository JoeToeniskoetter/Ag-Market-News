import React, { useContext } from 'react';
import { Alert, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';
import { MyReportsContext, useMyReports } from '../../../../Providers/MyReportsProvider';
import { SearchContext, useSearch } from '../../../../Providers/SearchProvider';
import { Report } from '../../../../shared/types';
import { sendShare } from '../../../../shared/util';

interface IFavOrShareProps {
  report: Report
}

export const FavOrShareButton: React.FC<IFavOrShareProps> = ({ report }) => {
  const { addReport, reports: myReports } = useMyReports();
  const { currentReportUrl } = useSearch();

  console.log("CURR URL: ", currentReportUrl)

  if (myReports?.some(x => x.slug_name == report.slug_name)) {
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
        onPress={() => sendShare(`Check out this report! - ${report.report_title}: ${publishedDate}`, currentReportUrl || reportUrl)}
      />
    )

  }

  return (
    <Button
      title="Favorite"
      type='clear'
      onPress={async () => {
        let reportCopy = Object.assign({}, report)
        reportCopy.report_url = currentReportUrl;
        await addReport(reportCopy);
        await Alert.alert(`${reportCopy.slug_name} Saved to Favorites`)
      }}
      style={{ paddingRight: 20 }}
      titleStyle={{ color: Platform.OS == 'ios' ? '#007aff' : 'black' }}
    />
  )
}