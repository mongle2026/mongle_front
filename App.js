import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import ButtonIconS from './shared/components/ButtonIconS';
import ButtonIconL from './shared/components/ButtonIconL';
import ButtonText from './shared/components/ButtonText';
import ic_x from './assets/icons/ic_x.svg';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
       <ButtonIconS
        Icon={ic_x}
        onPress={() => console.log('pressed')}
      />
      <ButtonIconL
        Icon={ic_x}
        onPress={() => console.log('pressed')}
      />
      <ButtonText
  label="버튼"
  type="brand"
  onPress={() => console.log('brand')}
/>

<ButtonText
  label="버튼"
  type="neutral"
  onPress={() => console.log('neutral')}
/>

<ButtonText
  label="버튼"
  disabled
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
