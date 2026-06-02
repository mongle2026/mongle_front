import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';

import LetterScreen from './features/write/letter/LetterScreen';
import Img from './features/write/components/Img';

const Stack = createNativeStackNavigator();

function ImgTestScreen() {
  const [selectedImage, setSelectedImage] = useState(
    require('./assets/write/cover_img.png')
  );

  return (
    <View style={styles.container}>
      <Img
        imageSource={selectedImage}
        onPressDelete={() => setSelectedImage(null)}
        style={styles.imageItem}
      />

      <Img
        onPressAdd={() => console.log('이미지 추가')}
        style={styles.imageItem}
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
      <StatusBar style="auto" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ImgTest" component={ImgTestScreen} />
        <Stack.Screen name="Letter" component={LetterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageItem: {
    flex: 1,
  },
});