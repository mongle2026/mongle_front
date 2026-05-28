import { View, StyleSheet } from 'react-native';

export default function SafeArea({ style }) {
  return <View style={[styles.container, style]} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    alignItems: 'flex-start',
  },
});