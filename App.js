import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from './shared/styles/color';
import RecordScreen from './features/write/record/RecordScreen.jsx';
import LetterCoverSelect from './features/write/letter/LetterCoverSelect.jsx';
import SelectDateScreen from './features/write/selectdate/SelectDateScreen.jsx';

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
        <StatusBar style="light" />

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Record"
            component={RecordScreen}
          />

          <Stack.Screen
            name="LetterCoverSelect"
            component={LetterCoverSelect}
          />
          
          <Stack.Screen
            name="SelectDate"
            component={SelectDateScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}