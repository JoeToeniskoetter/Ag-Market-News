import {Button, ListItem, Switch} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {StyledText, TextType} from '../../shared/components/Text';
import {Colors} from '../../shared/util';

interface NotificationsProps {}

export const Notifications: React.FC<NotificationsProps> = ({}) => {
  const [
    receiveNewReportNotifications,
    setReceiveNewReportNotifications,
  ] = useState<boolean>(false);

  const onReceiveNewReportNotificationsChanged = (value: boolean) => {
    if (receiveNewReportNotifications) {
      Alert.alert(
        'Unsubscribe?',
        'Are you sure you want to unsubscribe from all report notifications?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              return false;
            },
            style: 'cancel',
          },
          {
            text: 'Unsubscribe',
            onPress: () => setReceiveNewReportNotifications(value),
          },
        ],
      );
    } else {
      setReceiveNewReportNotifications(value);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            <StyledText value="New Reports" type={TextType.SMALL_HEADING} />
          </ListItem.Title>
        </ListItem.Content>
        <Switch
          color="green"
          value={receiveNewReportNotifications}
          onValueChange={onReceiveNewReportNotificationsChanged}
        />
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            <StyledText value="App Updates" type={TextType.SMALL_HEADING} />
          </ListItem.Title>
        </ListItem.Content>
        <Switch color="green" value={true} onValueChange={value => {}} />
      </ListItem>
    </View>
  );
};
