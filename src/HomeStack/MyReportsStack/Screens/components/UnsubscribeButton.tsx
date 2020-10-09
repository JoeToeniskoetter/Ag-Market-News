import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const UnsubscribeButton:React.FC<{}> = () => {
  return (
    <TouchableOpacity>
      <View style={styles.leftButton}>
        <AntDesign name="closecircleo" size={24} color="#a3a3a3" />
        <Text style={styles.actionText}>Unsubscribe</Text>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  leftButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ebebeb',
    height: '100%',
    padding: 20
  },
  actionText: {
    fontWeight: '600',
    color: '#a3a3a3',
  }
})