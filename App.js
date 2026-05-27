import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import ButtonIcon from './shared/components/ButtonIcon';
import ButtonText from './shared/components/ButtonText';
import ic_x from './assets/icons/ic_x.svg';
import Button from './shared/components/Button';
import BottomBar from './src/write/components/BottomBar.jsx'
import Dialog from './shared/components/Dialog';
import SearchField from './shared/components/SearchField';
import { useState } from 'react';
import Toast from './shared/components/Toast';
import TopNavigation from './shared/components/TopNavigation.jsx';
import ListRow from './src/write/components/ListRow.jsx';
import SelectRecipient from './src/write/SelectRecipient.jsx';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.ttf'),
  });

  const [keyword, setKeyword] = useState('');

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      
      <SelectRecipient />

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
