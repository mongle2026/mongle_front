import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import RecipientEmptyView from './features/write/recipient/RecipientEmptyViewScreen.jsx';

const Stack = createNativeStackNavigator();

function RecipientEmptyViewTestScreen() {
  return (
    <RecipientEmptyView
      keyword="없는검색어"
      onChangeKeyword={text => console.log(text)}
      onFocusSearch={() => console.log('focus search')}
      onPressBack={() => console.log('back')}
    />
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
          name="RecipientEmptyViewTest"
          component={RecipientEmptyViewTestScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}