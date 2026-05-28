import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LetterPage from './features/letter/LetterPage';

import { useFonts } from 'expo-font';
import TopNavigation from './shared/components/TopNavigation';
import SelectRecipient from './src/write/SelectRecipient.jsx';
import SelectMusic from './src/write/SelectMusic.jsx';

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
