import React from 'react';
import { Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Report } from '../../../../Providers/SearchProvider';
import { RemoveActionButton } from './RemoveActionButton';
import { SubscribeButton } from './SubscribeButton';
import { UnsubscribeButton } from './UnsubscribeButton';
import AntDesign from 'react-native-vector-icons/AntDesign';


interface ISavedReports {
  item: Report;
  navigation:any;
}

export const SavedReports: React.FC<ISavedReports> = ({ item, navigation}) => {

  const row: Array<any> = [];

  return (
      <ListItem bottomDivider
        onPress={() => {
          navigation.navigate("PDFView", { report: item })
        }}
      >
        {item.report_url?.includes('pdf') ? <AntDesign name="pdffile1" size={24} color={'black'} /> : <AntDesign name="filetext1" size={24} color={'black'} />
        }
        <ListItem.Content>
          {item.subscribed ? <Text style={{ fontSize: 9, color: 'green', alignSelf: 'flex-start' }}>Subscribed <AntDesign name="checkcircleo" size={9} /></Text> : null}
          <ListItem.Title>{item.report_title}</ListItem.Title>
          <ListItem.Subtitle style={{ fontWeight: 'bold' }}>{`Report ID: ${item.slug_name}`}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
  )
}