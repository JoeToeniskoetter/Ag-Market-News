import React from 'react';
import {Alert, Platform, View} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {useMyReports} from '../../../../Providers/MyReportsProvider';
import {useCurrentReport} from '../../../../Providers/CurrentReportProvider';
import {Report} from '../../../../shared/types';
import {sendShare} from '../../../../shared/util';

interface IFavOrShareProps {
  report: Report;
}

export const FavOrShareButton: React.FC<IFavOrShareProps> = ({report}) => {
  const {addReport, removeReport, reports: myReports} = useMyReports();
  const {currentReportUrl} = useCurrentReport();

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
          Toast;
          await Toast.show({
            text1: 'Saved',
            text2: `${reportCopy.slug_name} Saved to Favorites`,
            visibilityTime: 1500,
          });
        }}
      />
      <Icon
        name={Platform.OS == 'ios' ? 'share-apple' : 'share-google'}
        color={'white'}
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
