import React from 'react'
import { FlexAlignType, View } from 'react-native';

interface ISectionProps {
  alignItems: FlexAlignType,
  justifyContent: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | undefined
}

const Row: React.FC<ISectionProps> = ({ children, alignItems, justifyContent }) => {
  return (
    <View style={{ width: '100%', flexDirection: 'row', alignItems: alignItems, justifyContent: justifyContent }}>
      {children}
    </View>
  )
}

const Column: React.FC<ISectionProps> = ({ children, alignItems, justifyContent }) => {
  return (
    <View style={{ width: '100%', height: '100%', flexDirection: 'column', alignItems, justifyContent }}>
      {children}
    </View>
  );
}

export { Row, Column };