import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
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

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <SelectMusic />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});