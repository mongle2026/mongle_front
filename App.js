import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

import { colors } from './shared/styles/color';
import SelectRecipientScreen from './features/write/recipient/SelectRecipientScreen.jsx';
import SelectMusic from './features/write/music/SelectMusic.jsx';
import RecordScreen from './features/write/record/RecordScreen.jsx';
import Carousel from './shared/components/Carousel.jsx';
import BottomNavigationItem from './shared/components/BottomNavigationItem.jsx';
import BottomNavigation from './shared/components/BottomNavigation.jsx';
import FAB from './shared/components/FAB.jsx';
import MusicPlay from './shared/components/MusicPlay.jsx';
import TopNavigation from './features/feed/components/TopNavigation.jsx';
import BottomBar from './features/feed/components/BottomBar.jsx';
import IcHome from './assets/icons/ic_home.svg';
import IcLetter from './assets/icons/ic_letter.svg';
import { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState('추천');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bgLayerDefault }} contentContainerStyle={{ gap: 24, paddingBottom: 40 }}>
      {/* TopNavigation */}
      <TopNavigation activeTab={activeTab} onTabPress={setActiveTab} />

      {/* MusicPlay */}
      <MusicPlay
        title="음악 선택"
        artist="Honne"
        audioUri="https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/dc/bc/8a/dcbc8a3e-4ce1-c00d-cc02-eda2212053c7/mzaf_8347559338388601510.plus.aac.p.m4a"
      />
    </ScrollView>
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
          name="Record"
          component={RecordScreen}
        />
        <Stack.Screen
          name="SelectRecipientScreen"
          component={SelectRecipientScreen}
        />
        <Stack.Screen
          name="SelectMusic"
          component={SelectMusic}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}