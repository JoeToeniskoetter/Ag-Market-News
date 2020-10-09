import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const SubscribeButton: React.FC<{}> = () => {
  return (
    <TouchableOpacity>
      <View style={styles.leftButton}>
        <AntDesign name="checkcircleo" size={24} color="white" />
        <Text style={styles.actionText}>Subscribe</Text>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  leftButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8df578',
    height: '100%',
    padding: 20
  },
  actionText: {
    fontWeight: '600',
    color: '#fff',
  }
})