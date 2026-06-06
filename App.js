import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LetterScreen from './features/write/letter/LetterScreen';
import { colors } from './shared/styles/color';
import SelectRecipientScreen from './features/write/recipient/SelectRecipientScreen.jsx';
import SelectMusic from './features/write/music/SelectMusic.jsx';
import RecordScreen from './features/write/record/RecordScreen.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bgDefault } }}>
    <SafeAreaProvider>
    <NavigationContainer>
      <StatusBar style="light" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="LetterScreen"
          component={LetterScreen}
          name="SelectRecipientScreen"
          component={SelectRecipientScreen}
        />
        <Stack.Screen
          name="SelectMusic"
          component={SelectMusic}
        />
        <Stack.Screen
          name="Record"
          component={RecordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}