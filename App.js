import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { colors } from './shared/styles/color';
import SelectRecipientScreen from './features/write/recipient/SelectRecipientScreen.jsx';
import SelectMusic from './features/write/music/SelectMusic.jsx';
import RecordScreen from './features/write/record/RecordScreen.jsx';
import Carousel from './shared/components/Carousel.jsx';
import BottomNavigationItem from './shared/components/BottomNavigationItem.jsx';
import BottomNavigation from './shared/components/BottomNavigation.jsx';
import IcHome from './assets/icons/ic_home.svg';
import IcLetter from './assets/icons/ic_letter.svg';

const Stack = createNativeStackNavigator();

const ONE_IMAGE = [require('./assets/write/cover_img.png')];
const TWO_IMAGES = [
  require('./assets/write/cover_img.png'),
  require('./assets/write/profile_img.png'),
];
const PROFILE_SOURCE = require('./assets/write/profile_img.png');

const NAV_ITEMS = [
  { type: 'icon',    isActive: true,  Icon: IcHome },
  { type: 'icon',    isActive: false, Icon: IcLetter },
  { type: 'profile', isActive: false, profileSource: PROFILE_SOURCE },
];

function TestScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgLayerWeak }}>
      <View style={{ flex: 1, justifyContent: 'center', gap: 32, paddingHorizontal: 16 }}>
        {/* Carousel: 1장(dots 없음, 스크롤 고정) */}
        <Carousel images={ONE_IMAGE} />

      </View>

      {/* BottomNavigation */}
      <BottomNavigation items={NAV_ITEMS} />
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
    <SafeAreaProvider>
    <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bgDefault } }}>
      <StatusBar style="light" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Test"
          component={TestScreen}
        />
        <Stack.Screen
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