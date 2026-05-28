import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeArea({ style }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          height: insets.top,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});