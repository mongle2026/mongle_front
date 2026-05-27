import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import ButtonIcon from './shared/components/ButtonIcon';
import ButtonText from './shared/components/ButtonText';
import ic_x from './assets/icons/ic_x.svg';
import Button from './shared/components/Button';

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
       <ButtonIcon
        Icon={ic_x}
        onPress={() => console.log('pressed')}
      />
      <ButtonIcon
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


      <Button
        label="버튼"
        color="neutralWeak"
        onPress={() => console.log('neutral')}
      />

      <Button
        label="버튼"
        color="critical"
        onPress={() => console.log('critical')}
      />

      <Button
        label="버튼"
        color="brand"
        onPress={() => console.log('brand')}
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
