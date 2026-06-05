import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, StyleSheet } from 'react-native';

import SelectMusic from './features/write/music/SelectMusic';
import { colors } from './shared/styles/color';

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
          name="SelectMusic"
          component={SelectMusic}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.bgDefault,
  },
});