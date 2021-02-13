import React from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, TouchableHighlight, Linking, Share, Alert, Platform } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Antdesign from 'react-native-vector-icons/AntDesign';


interface SettingsProps {

}

interface SupportSelectionProps {
  onPress: Function,
  title: string,
  color: string,
  iconName: string,
  iconType: string
}

const SupportSelection: React.FC<SupportSelectionProps> = ({ onPress, color, iconName, iconType, title }) => {
  return (
    <TouchableHighlight onPress={() => onPress()}>
      <ListItem bottomDivider>
        {iconType === "antdesign" ? <Antdesign name={iconName} size={20} color={color} /> : <Fontawesome name={iconName} size={20} color={color} />}
        <ListItem.Title>{title}</ListItem.Title>
        <ListItem.Content>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </TouchableHighlight>
  )
}

const openEmail = () => {
  return Linking.openURL('mailto:support@example.com')
}

const shareAppLink = async () => {
  const GOOGLE_PLAY_URL: string = 'https://play.google.com/store/apps/details?id=com.ag_market_news.android';
  const APP_STORE_URL: string = 'https://apps.apple.com/us/app/ag-market-news/id1538518553';
  try {
    const result = await Share.share({
      title: 'App link',
      message: `Check out this app! ${Platform.OS === 'ios' ? APP_STORE_URL : GOOGLE_PLAY_URL}`
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
}

const data = [
  {
    title: 'Rate Ag Market News',
    iconName: "staro",
    iconType: "antdesign",
    color: "#ccc900",
    onPress: () => { }
  },
  {
    title: 'Share Ag Market News',
    iconName: 'share',
    iconType: 'fontawesome',
    color: "black",
    onPress: shareAppLink
  },
  {
    title: 'Leave a Tip',
    iconName: 'dollar',
    iconType: 'fontawesome',
    color: "green",
    onPress: () => { }
  },
  {
    title: 'Feedback / Feature Request',
    iconName: 'message1',
    iconType: 'antdesign',
    color: "black",
    onPress: openEmail,
  }
]

export const Settings: React.FC<SettingsProps> = ({ }) => {

  return (
    <View style={styles.container}>
      <Text h2 style={styles.header}>Settings</Text>
      <View style={styles.supportItemContainer}>
        <FlatList
          contentContainerStyle={{ height: '100%', borderRadius: 20 }}
          bounces={false}
          data={data}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <SupportSelection title={item.title} iconName={item.iconName} iconType={item.iconType} color={item.color} onPress={item.onPress} />
          )}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    marginTop: '10%',
  },
  supportItemContainer: {
    padding: 20,
    borderRadius: 80,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    padding: 20
  }
})