import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SystemBars } from 'react-native-edge-to-edge';

import { colors } from './shared/styles/color';
import RecordScreen from './features/write/record/RecordScreen.jsx';
import TopNavigation from './features/feed/components/TopNavigation.jsx';
import Post from './features/feed/components/Post.jsx';
import Caption from './features/feed/components/Caption.jsx';
import FAB from './shared/components/FAB.jsx';
import FeedHomeScreen from './features/feed/home/FeedHomeScreen.jsx';
import FeedDetailScreen from './features/feed/detail/FeedDetailScreen.jsx';
import LetterCoverSelect from './features/write/letter/LetterCoverSelect.jsx';
import SelectDateScreen from './features/write/selectdate/SelectDateScreen.jsx';
import SendAnimationScreen from './features/write/send/SendAnimationScreen.jsx';
import SelectRecipientScreen from './features/write/recipient/SelectRecipientScreen.jsx';
import SelectMusic from './features/write/music/SelectMusic.jsx';
import LetterHomeScreen from './features/letter/home/LetterHomeScreen.jsx';
import FabMenuModalScreen from './features/feed/home/FabMenuModalScreen.jsx';
import RecordEditScreen from './features/write/record/RecordEditScreen.jsx';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PROFILE_SOURCE = require('./assets/write/profile_img.png');
const COVER_SOURCE = require('./assets/write/cover_img.png');
const POST_IMAGES = [
  require('./assets/write/cover_img.png'),
  require('./assets/write/profile_img.png'),
];
const CONTENT = '사실 \'읽기\'란 두려운 것이다. 사사키 아타루가 \'읽기\'와 혁관계를 논의하며 가장 먼저 강조했던 것이 읽기란 본래 영적 접속이기에 읽는 자들은 자연스럽게 자기방어를 하게하사실이 아니었던가. 카프카의 소설을 읽는다는 것은 카기기꿈을 자신의 꿈으로 겪어내야 하는 일이고, 머아카. 읽기란 언제나 자신을 낯선 세계로 이끄는 행위이며 그 낯섦 속에서 우리는 비로소 자기 자신을 발견하게 된다. 책 한 권을 덮는 순간 독자는 더 이상 이전의 자신이 아니다.';

function TestScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('추천');
  const [bookmarked1, setBookmarked1] = useState(false);
  const [liked1, setLiked1] = useState(false);
  const [bookmarked2, setBookmarked2] = useState(false);
  const [liked2, setLiked2] = useState(false);
  const [bookmarked3, setBookmarked3] = useState(false);
  const [liked3, setLiked3] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bgLayerDefault }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TopNavigation activeTab={activeTab} onTabPress={setActiveTab} />

        {/* FeedDetail 테스트 버튼 */}
        <Pressable
          onPress={() => navigation.navigate('FeedDetail', {
            musicTitle: '음악 선택',
            musicArtist: 'Honne',
            musicCover: COVER_SOURCE,
            content: CONTENT,
            images: POST_IMAGES,
            name: '코코',
            date: '26.06.01 10:35',
            bookmarkCount: 5,
          })}
          style={{ margin: 16, padding: 12, backgroundColor: colors.fgBrand, borderRadius: 8, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontFamily: 'Pretendard-SemiBold', fontSize: 14 }}>FeedDetail 테스트</Text>
        </Pressable>

        {/* Caption */}
        <Caption date="26.06.01 10:35" bookmarkCount={5} />

        {/* textOnly */}
        <Post
          type="textOnly"
          currentView
          content={CONTENT}
          name="코코"
          date="26.05.03"
          profileSource={PROFILE_SOURCE}
          isBookmarked={bookmarked1} onPressBookmark={() => setBookmarked1(b => !b)}
          isLiked={liked1} onPressLike={() => setLiked1(l => !l)}
        />

        {/* img */}
        <Post
          type="img"
          currentView
          content={CONTENT}
          images={POST_IMAGES}
          name="코코"
          date="26.05.03"
          profileSource={PROFILE_SOURCE}
          isBookmarked={bookmarked2} onPressBookmark={() => setBookmarked2(b => !b)}
          isLiked={liked2} onPressLike={() => setLiked2(l => !l)}
        />

      </ScrollView>
      <View style={{ position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' }}>
        <FAB />
      </View>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Tab.Screen name="FeedHome" component={FeedHomeScreen} />
      <Tab.Screen name="Letter" component={LetterHomeScreen} />
    </Tab.Navigator>
  );
}
const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SystemBars style="light" />
        <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bgDefault } }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} options={{ animation: 'none' }} />
            <Stack.Screen name="FeedHome" component={FeedHomeScreen} options={{ animation: 'none' }} />
            <Stack.Screen
              name="FabMenuModal"
              component={FabMenuModalScreen}
              options={{
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'fade',
                contentStyle: {
                  backgroundColor: 'transparent',
                },
              }}
            />
            <Stack.Screen name="LetterCoverSelect" component={LetterCoverSelect} />
            <Stack.Screen name="Test" component={TestScreen} />
            <Stack.Screen name="FeedDetail" component={FeedDetailScreen} />
            <Stack.Screen name="SelectRecipientScreen" component={SelectRecipientScreen} />
            <Stack.Screen name="SelectMusic" component={SelectMusic} />
            <Stack.Screen name="Record" component={RecordScreen} />
            <Stack.Screen name="RecordEdit" component={RecordEditScreen} />
            <Stack.Screen name="SelectDate" component={SelectDateScreen} />
            <Stack.Screen name="SendAnimation" component={SendAnimationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
