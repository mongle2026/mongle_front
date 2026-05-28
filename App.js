import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LetterPage from './features/letter/LetterPage';

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
import ListHeader from './shared/components/ListHeader.jsx';
import Music from './shared/components/Music.jsx';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.ttf'),
  });

  const [keyword, setKeyword] = useState('');
  const Stack = createNativeStackNavigator();


  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Letter"
          component={LetterPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
