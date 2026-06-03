import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, StyleSheet } from 'react-native';

import ListRow from './features/write/components/ListRow';
import { colors } from './shared/styles/color';

const Stack = createNativeStackNavigator();

function ListRowTestScreen() {
  return (
    <View style={styles.container}>
      <ListRow
        title="name(나)"
        subtitle="@memeow"
        img="profile"
        caption
        selected={false}
        onPress={() => console.log('첫 번째 선택')}
      />

      <ListRow
        title="코코"
        subtitle="@cocokim"
        img="profile"
        caption
        selected
        onPress={() => console.log('두 번째 선택')}
      />

      <ListRow
        title="Warm On A Cold Night"
        subtitle="Honne"
        img="music"
        caption
        selected={false}
        onPress={() => console.log('음악 선택')}
      />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <StatusBar style="light" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="ListRowTest"
          component={ListRowTestScreen}
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