import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MyReportsContext } from '../../../../Providers/MyReportsProvider';
import { Report } from '../../../../Providers/SearchProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface IRemoveActionButon {
  setSavedReports: (reports: Report[]) => void;
  savedReports: Report[];
  item: Report;
}

export const RemoveActionButton: React.FC<IRemoveActionButon> = ({setSavedReports, savedReports, item}) => {

  const { removeReport, unsubscribeToReport } = useContext(MyReportsContext);
  
  return (
    <TouchableOpacity
      onPress={async () => {
        let filteredReports = savedReports.filter((x: Report) => {
          return x.slug_name !== item.slug_name
        });
        await removeReport(item.slug_name);
        await unsubscribeToReport(item);
        await setSavedReports(filteredReports);
      }}
    >
      <View style={styles.rightButton}>
        <FontAwesome name="trash" size={24} color="white" />
        <Text style={styles.actionText}>Remove</Text>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  rightButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dd2c00',
    height: '100%',
    padding: 20
  },
  actionText: {
    fontWeight: '600',
    color: '#fff',
  }
})