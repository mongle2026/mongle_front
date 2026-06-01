import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // 추가
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import TabBar from './shared/components/TabBar'; // 추가
import LetterScreen from './features/write/letter/LetterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // 추가

function PlaceholderScreen() { // 추가: 탭 화면 확정 전 임시 화면
  return <View style={{ flex: 1 }} />;
}

function WriteStack() { // 추가: 쓰기 탭 내부 스택
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Letter" component={LetterScreen} />
    </Stack.Navigator>
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
      {/* 추가: 커스텀 TabBar 연결 */}
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="탭1" options={{ tabBarLabel: '탭1' }} component={PlaceholderScreen} />
        <Tab.Screen name="탭2" options={{ tabBarLabel: '탭2' }} component={WriteStack} />
        <Tab.Screen name="탭3" options={{ tabBarLabel: '탭3' }} component={PlaceholderScreen} />
        <Tab.Screen name="탭4" options={{ tabBarLabel: '탭4' }} component={PlaceholderScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
