import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/Ionicons';

interface InstructionsScreenProps {
  onInstructionsSeen: Function
}

const steps = [
  {
    id: 1,
    title: 'Select mode of search',
    image: require('../../assets/instructions/search.png')
  },
  {
    id: 2,
    title: 'Make a search selection',
    image: require('../../assets/instructions/search-selection.png')
  },
  {
    id: 3,
    title: 'Select a Report',
    image: require('../../assets/instructions/select-report.png')
  },
  {
    id: 4,
    title: 'Favorite a report',
    image: require('../../assets/instructions/view-report.png')
  },
  {
    id: 5,
    title: `Subscribe and be notified when a new report is available`,
    image: require('../../assets/instructions/subscribe.png')
  },
  {
    id: 6,
    title: `Swipe left to unfavorite`,
    image: require('../../assets/instructions/remove-report.png')
  }
];


export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onInstructionsSeen }) => {
  const _renderItem = ({ item }: any) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#73baf5' }}>
        <Text style={{ fontSize: 30, padding: 20, color: 'white', fontWeight: 'bold' }}>{item.title}</Text>
        <View style={{
          shadowColor: '#000000',
          shadowOffset: { width: 2, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 2,
          height: '65%'
        }}>
          <Image
            source={item.image}
            resizeMode={'contain'}
            style={{ height: '100%', borderRadius: 10, }}
          />
        </View>
        <Text>{item.text}</Text>
      </View>
    );
  }
  const _onDone = () => {
    onInstructionsSeen()
  }

  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="arrow-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
        {/* <Text>Done</Text> */}
      </View>
    );
  };
  return (
    <AppIntroSlider
      keyExtractor={(item) => item.id.toString()}
      renderItem={_renderItem}
      data={steps}
      onDone={_onDone}
      renderNextButton={_renderNextButton}
      renderDoneButton={_renderDoneButton}
    />
  )
}


const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //[...]
});
