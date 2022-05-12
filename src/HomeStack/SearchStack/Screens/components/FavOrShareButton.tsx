import React from 'react';
import {Alert, Platform, View} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useMyReports} from '../../../../Providers/MyReportsProvider';
import {useSearch} from '../../../../Providers/SearchProvider';
import {Report} from '../../../../shared/types';
import {sendShare} from '../../../../shared/util';

interface IFavOrShareProps {
  report: Report;
}

export const FavOrShareButton: React.FC<IFavOrShareProps> = ({report}) => {
  const {addReport, removeReport, reports: myReports} = useMyReports();
  const {currentReportUrl} = useSearch();

  let reportUrl = '';
  let publishedDate = '';

  if (myReports?.some(x => x.slug_name == report.slug_name)) {
    const reportType = report.report_url?.includes('pdf') ? 'pdf' : 'txt';
    reportUrl = `https://www.ams.usda.gov/mnreports/${report.slug_name}.${reportType}`;
    publishedDate = new Date(
      report.published_date.toString().split(' ')[0],
    ).toDateString();
  }

  const subscribed = myReports?.some(x => x.slug_name == report.slug_name);

  return (
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
      <AntDesign
        name={subscribed ? 'heart' : 'hearto'}
        color="red"
        size={25}
        style={{paddingRight: 20}}
        onPress={async () => {
          if (subscribed) {
            removeReport(report);
            return;
          }
          let reportCopy = Object.assign({}, report);
          reportCopy.report_url = currentReportUrl;
          await addReport(reportCopy);
          await Alert.alert(`${reportCopy.slug_name} Saved to Favorites`);
        }}
      />
      <Icon
        name={Platform.OS == 'ios' ? 'share-apple' : 'share-google'}
        color={Platform.OS == 'ios' ? 'rgb(0, 122, 255)' : 'black'}
        size={38}
        style={{paddingRight: 20}}
        onPress={() =>
          sendShare(
            `Check out this report! - ${report.report_title}: ${publishedDate}`,
            currentReportUrl || reportUrl,
          )
        }
      />
    </View>
  );
};
